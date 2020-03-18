import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import socket from "socket.io-client";
import axios from "axios";
import ChatBcust from "./ChatBcust";
import "./ChatBox.css";
import uuid from "react-uuid";


class ChatBoxed extends Component {

  scrollToBottomContainer = React.createRef();

  constructor(props) {
    super(props);

    let io = socket.connect("http://localhost:5000");

    this.myRef = React.createRef();

    this.state = {
      message: "",
      channelId: "",
      io,
      sender: "",
      receiver: "",
      messages: [],
      messaged: [],
      mounted: false,
      offset: null,
      limit: 10,
      interval: false,
      image: null,
      imageUrl: null,
      imageFlag: true,
      timestamp: null,
      onDelete: true
    };

    this.scrollToBottomContainer = React.createRef();

    this.user = { uid: JSON.parse(localStorage.getItem("username")) };
  }


  componentDidMount() {
    console.log("componentdidmount");
    this.listening();
  }

  componentWillUnmount() {
    console.log("componentwillmount");
    window.onscroll = null;
  }

  addMessage = message => {
    const { channelId } = this.state;
    console.log("addmessage 8", message);

    let messagess = [
      {
        text: message.text,
        id: uuid(),
        timestamp: message.timestamp,
        likeflag: message.likeflag,
        tickflag: message.tickflag,
        imageUrl: message.imageUrl,
        messageflag: message.messageflag,
        sender: {
          uid: message.sender.uid,
          heartColor: "grey"
        }
      }
    ];

    this.setState(
      prevState => {
        return {
          message: "",
          imageUrl: "",
          messaged: [...prevState.messaged, ...messagess]
        };
      },
      () => {
        this.state.io.emit("tick-flag", { receiver: this.state.receiver });
      }
    );
  };

  js = () => {
    document.getElementsByClassName("chat-box");
    console.log("scrolling");
  };

  handleChange = e => {
    console.log("handlechange");
    this.setState({ message: e.target.value }, () =>
      console.log("sss ", this.state.message)
    );
  };

  sendMessage = event => {
    event.preventDefault();
    const { channelId, io, message, sender, receiver, imageUrl } = this.state;
    console.log("channelid ", channelId);
    console.log("sender", JSON.parse(localStorage.getItem("username")));

    let group = {
      sender: JSON.parse(localStorage.getItem("username")),
      text: message,
      groupname: receiver,
      timestamp: new Date(),
      likeflag: false,
      imageUrl: imageUrl,
      messageflag: true

    };

    let data = {
      text: message,
      id: channelId,
      timestamp: new Date(),
      likeflag: false,
      tickflag: false,
      imageUrl: imageUrl,
      messageflag: true,
      sender: {
        uid: this.state.sender,
        receiver: receiver,
        heartColor: "grey"
      }
    };
    console.log("data emitting 4", data);
    this.props.flag ? io.emit("message", data) : io.emit("groupmessage", group);
  };

  setGroupMessage = messages => {
    console.log("getgroupmessage", messages);
    let objMessage = messages.map(message => {
      return {
        text: message.message,
        sender: message.sender,
        timestamp: message.timestamp,
        likeflag: message.likeflag,
        imageUrl: message.images,
        messageflag: message.messageflag
      };
    });

    this.setState({
      messaged: [...objMessage]
    });
  };

  setMessages = messages => {
    console.log("setMessages", messages);
    let objMessage = messages.map((messages, index) => {
      return {
        text: messages.message,
        id: uuid(),
        timestamp: messages.timestamp,
        likeflag: messages.likeflag,
        tickflag: messages.tickflag,
        imageUrl: messages.images,
        messageflag: messages.messageflag,
        sender: {

          uid: messages.sender,
          heartColor: "grey"

        }
      };
    });

    this.setState({
      messaged: objMessage
    });
  };

  componentWillReceiveProps = async nextProps => {

    if (nextProps !== this.props) {

      await this.setState(
        {
          channelId: [
            nextProps.flag
              ? JSON.parse(localStorage.getItem("username"))
              : null,
            nextProps.receiver
          ]
            .sort()
            .join(),
          receiver: nextProps.receiver,
          sender: nextProps.flag
            ? JSON.parse(localStorage.getItem("username"))
            : null,
          limit: 10,
          offset: null
        },
        () => {
          if (this.props.flag) this.getData();
          else this.getGmess();
        }
      );
    }
    this.listening();
  };

  getGmess = () => {
    this.state.io.on(this.state.receiver, data => {
      document.getElementById("uploadCaptureInputFile").value = "";
      console.log("grouplistening", data);
      this.groupMessage(data);
    });


    const { receiver, offset, limit } = this.state;
    let groupname = {
      groupname: receiver
    };

    axios
      .post("http://localhost:5000/group/getmessage", { ...groupname })
      .then(res => {
        console.log("getmessages from groupchat");
        console.log("res", res.data);

        this.setState(
          {
            mounted: true,
            offset: res.data.rowCount
          },
          () => this.getGmessOffset()
        );
      });
  };

  getGmessOffset = () => {
    console.log("getGroupmessage offset", this.state.offset, this.state.limit);

    const { receiver, offset, limit } = this.state;

    let groupname = {
      groupname: receiver
    };

    axios
      .post(
        `http://localhost:5000/group/getmessageoffset?limit=${limit}&offset=${offset -
        10}`,
        { ...groupname }
      )
      .then(res => {
        console.log("res", res.data.rows);
        this.setGroupMessage([...res.data.rows]);
        this.setState({
          offset: this.state.offset - 10,
          limit: this.state.limit + 10
        });
      });
  };

  getData = () => {

    this.state.io.on(this.state.channelId, message => {
      document.getElementById("uploadCaptureInputFile").value = "";
      console.log("get data Emitted 7", message);


      this.addMessage(message);
    });

    const { sender, receiver } = this.state;
    console.log("getData", sender, receiver);

    let data = {
      sender: sender,
      receiver: receiver
    };

    axios
      .post("http://localhost:5000/usermessages/getmessages", { ...data })
      .then(res => {
        console.log(" data res", res.data.rowCount);
        this.setState(
          {
            mounted: true,
            offset: res.data.rowCount
          },
          () => this.getDataOffset()
        );
      });
  };

  getDataOffset = () => {
    console.log("getDataMessage offset", this.state.offset, this.state.limit);
    const { sender, receiver, limit, offset } = this.state;


    let data = {
      sender: sender,
      receiver: receiver
    };

    axios
      .post(
        `http://localhost:5000/usermessages/getmessagesoffset?limit=${limit}&offset=${offset -
        10}`,
        {
          ...data
        }
      )
      .then(res => {
        console.log("res", res.data.rows);
        this.setMessages([...res.data.rows]);
        this.setState({
          mounted: true,
          limit: this.state.limit + 10,
          offset: this.state.offset - 10
        });
      });
  };

  groupMessage = data => {
    console.log("groupMessage");
    console.log(data);

    this.setState(prevState => {
      return {
        message: "",
        imageUrl: "",
        messaged: [...prevState.messaged, data]
      };
    });
  };

  handleScroll = e => {
    console.log("ahai");
    const scrollY = window.scrollY;
    const scrollTop = this.myRef.current.scrollTop;
    console.log(
      `onScroll, window.scrollY: ${scrollY} myRef.scrollTop: ${scrollTop}`
    );

    if (scrollTop === 0) {
      this.callAlert();
    }
  };

  callAlert = () => {

    console.log("calling alert");

    this.props.flag ? this.getDataOffset() : this.getGmessOffset();
  };

  scrollToBottom = () => {
    this.scrollToBottomContainer.current.scrollIntoView();
  };

  componentDidUpdate() {
    document.getElementById("chat_box").scrollTo(0, 1000);
  }

  imageChange = e => {
    console.log("imagechange 1", e.target.files[0]);

    this.setState(
      {
        image: e.target.files[0]
      },
      () => {
        this.imageMulter();
      }
    );
  };

  imageMulter = async () => {
    const { image } = this.state;

    console.log("imagemulter 1", image);

    let formData = new FormData();

    await formData.append("myImage", image);

    console.log(formData, image);

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    await axios
      .post("http://localhost:5000/upload", formData, config)
      .then(res => {
        console.log("image socket 3", res.data);
        if (res.data == "error") {
          alert("file too large");
          document.getElementById("uploadCaptureInputFile").value = "";
          this.setState({
            imageFlag: false
          });
        } else {
          this.setState({
            imageFlag: true,
            imageUrl: res.data
          });
        }
      });
  };

  softDelete = timestamp => {
    const { io, channelId, messaged } = this.state;
    console.log("softdelete ", timestamp);

    this.setState({

      timestamp: timestamp
    });

    io.emit("softdelete", {
      flag: this.props.flag,
      timestamp: timestamp,
      id: channelId
    });
  };

  listening = () => {
    const { io, channelId, messaged, timestamp } = this.state;
    io.on(channelId + "softdelete", data => {
      console.log("softdelete listening", messaged, channelId);
      console.log("messaged", messaged);

      let newMessaged = messaged.map(messaged => {
        if (messaged.timestamp === timestamp) {
          return {
            text: messaged.text,
            id: uuid(),
            timestamp: messaged.timestamp,
            likeflag: messaged.likeflag,
            tickflag: messaged.tickflag,
            imageUrl: messaged.imageUrl,
            messageflag: false,
            sender: {
              uid: messaged.sender.uid,
              heartColor: "grey"
            }
          };

        } else {
          return {
            text: messaged.text,
            id: uuid(),
            timestamp: messaged.timestamp,
            likeflag: messaged.likeflag,
            tickflag: messaged.tickflag,
            imageUrl: messaged.imageUrl,
            messageflag: messaged.messageflag,
            sender: {
              uid: messaged.sender.uid,
              heartColor: "grey"
            }
          };
        }
      });

      let groupMessage = messaged.map(messaged => {
        if (messaged.timestamp === timestamp) {
          return {
            text: messaged.text,
            id: uuid(),
            timestamp: messaged.timestamp,
            likeflag: messaged.likeflag,
            tickflag: messaged.tickflag,
            imageUrl: messaged.imageUrl,
            messageflag: false,
            sender: messaged.sender
          };

        } else {
          return {
            text: messaged.text,
            id: uuid(),
            timestamp: messaged.timestamp,
            likeflag: messaged.likeflag,
            tickflag: messaged.tickflag,
            imageUrl: messaged.imageUrl,
            messageflag: messaged.messageflag,
            sender: messaged.sender
          };
        }
      });

      console.log("new messaged", newMessaged);
      console.log("group message", groupMessage);
      this.setState(
        {
          messaged: this.props.flag ? newMessaged : groupMessage
        },
        () => {
          console.log("call back", this.state.messaged);
        }
      );
    });
  };

  render() {
    const { message, channelId, messages } = this.state;

    return (
      <div
        className="chat-box"
        id="chat_box"
        onScroll={e => this.handleScroll(e)}
        ref={this.myRef}
      >

        <div className="Container">
          <div className="chat-header">
            <div>
              <h5 className="h5-tag">{this.state.receiver}</h5>
            </div>

            {this.props.flag ? (
              <div style={{ position: "relative", left: "12px" }}>
                <i class="fas fa-circle"></i>
                <em>active</em>
              </div>
            ) : null}
          </div>


          {this.state.mounted && (
            <ChatBcust
              messages={this.state.messaged}
              user={this.user}
              flag={this.props.flag}
              softDelete={timestamp => this.softDelete(timestamp)}
            />
          )}

          <div ref={this.scrollToBottomContainer}></div>
          <div className="inputs-group">
            <form onSubmit={this.sendMessage}>
              <div className="flex-con">

                <input
                  type="text"
                  name="message"
                  className="form-control message-input"
                  placeholder="Type something"
                  onChange={this.handleChange}
                  value={message}
                />

                <input

                  className="inputfile"
                  type="file"
                  name="myImage"
                  id="uploadCaptureInputFile"
                  onChange={this.imageChange}
                />
                <input className="chat-submit" type="submit" value="send" />

              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ChatBoxed);
