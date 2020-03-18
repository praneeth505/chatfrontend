import React, { Component } from "react";
import axios from "axios";
import "./ChatBcust.css";

class ChatBcust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heartFlag: false,
      heartColour: "grey",
      messages: [...props.messages]
    };
  }

  colourChange = timestamp => {

    axios
      .put("http://localhost:5000/usermessages/update", {
        timestamp: timestamp
      })
      .then(res => {
        var messages = [];

        if (res.data.rowCount != 0) {
          messages = this.state.messages.map(message => {
            if (message.timestamp == timestamp) {
              message.likeflag = true;
            }
            return message;
          });

          this.setState({
            messages
          });
        }

      });
  };

  disLikeFlag = timestamp => {

    axios
      .put("http://localhost:5000/usermessages/updatedislike", {
        timestamp: timestamp
      })
      .then(res => {
        var messages = [];
        if (res.data.rowCount != 0) {
          messages = this.state.messages.map(message => {
            if (message.timestamp == timestamp) {
              message.likeflag = false;
            }
            return message;
          });

          this.setState({
            messages
          });
        }


      });
  };

  componentDidMount = async () => { };
  componentWillReceiveProps = nextProps => {
    if (nextProps.messages !== this.props.messages) {
      this.setState({ messages: nextProps.messages }, () => { console.log(this.state.messages) });
    }
  };

  render() {
    var currentDate = null;
    var oldDate = null;

    const { heartFlag, heartColour } = this.state;
    console.log("chatBcust ", this.state.messages);
    var today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday = yesterday.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    return (
      <div className="scroll-message" id="your_div">
        {this.state.messages.map((message, index) => {
          let date = new Date(message.timestamp);
          let time = date.getHours() + ":" + date.getMinutes();
          oldDate = currentDate;

          currentDate = new Date(message.timestamp);
          currentDate = currentDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          });
          return (
            <div>
              {currentDate !== oldDate ? (
                today === currentDate ? (
                  <div className="today">today</div>
                ) : yesterday === currentDate ? (
                  <div className="yesterday">yersterday</div>
                ) : (
                      <div className="dateformat">

                        {currentDate}

                      </div>
                    )
              ) : (
                  ""
                )}
              <div
                key={index}
                id={index}
                className="flex"
                style={
                  this.props.flag
                    ? message.sender.uid === this.props.user.uid
                      ? { display: "flex", flexDirection: "row-reverse" }
                      : null
                    : message.sender === this.props.user.uid
                      ? { display: "flex", flexDirection: "row-reverse" }
                      : null
                }
              >
                <div className="message-parent">
                  {this.props.flag ? (
                    message.sender.uid === this.props.user.uid ? (
                      message.messageflag ? (
                        <i
                          class="fas fa-trash-alt"
                          onClick={() =>
                            this.props.softDelete(message.timestamp)
                          }
                        ></i>
                      ) : null
                    ) : null
                  ) : message.sender === this.props.user.uid ? (
                    <i
                      class="fas fa-trash-alt"
                      onClick={() => this.props.softDelete(message.timestamp)}
                    ></i>
                  ) : null}
                  <div
                    key={message.id}
                    className="message-list"
                    style={
                      this.props.flag
                        ? message.sender.uid === this.props.user.uid
                          ? { backgroundColor: "blue", color: "white" }
                          : {
                            backgroundColor: "white",
                            boxShadow: "2px 2px 2px grey"
                          }
                        : message.sender === this.props.user.uid
                          ? { backgroundColor: "blue", color: "white" }
                          : {
                            backgroundColor: "white",
                            boxShadow: "2px 2px 2px grey"
                          }
                    }
                  >

                    <div className="message">
                      {message.imageUrl ? (
                        message.messageflag ? (
                          <img
                            src={message.imageUrl}
                            style={{ width: "115px", height: "100px" }}
                          ></img>
                        ) : (
                            "This message was deleted"
                          )
                      ) : message.messageflag ? (
                        message.text
                      ) : (
                            "This message was deleted"
                          )}
                    </div>
                    <div style={{ fontSize: "10px", marginLeft: "100px" }}>
                      {time}
                    </div>
                  </div>
                  <div className="tick-heart">
                    <div className="heart-div message-list">
                      {message.messageflag ? (
                        <i
                          onClick={
                            message.likeflag
                              ? () => this.disLikeFlag(message.timestamp)
                              : () => this.colourChange(message.timestamp)
                          }
                          style={{ color: message.likeflag ? "red" : "grey" }}
                          className="fas fa-heart"
                        ></i>
                      ) : null}
                    </div>
                    <div className="tick">
                      {message.messageflag ? (
                        message.sender.uid === this.props.user.uid ? (
                          message.tickflag ? (
                            <i class="fas fa-check-double" />
                          ) : (
                              <i class="fas fa-check"></i>
                            )
                        ) : (
                            ""
                          )
                      ) : null}
                    </div>
                    <div ref={this.messagesEndRef}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ChatBcust;
