import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import OnlineUsers from "../onlineusers/OnlineUsers";
import ChatBoxed from "../chatpage/ChatBoxs";
import "./HomePage.css";

import axios from "axios";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receiver: "",
      // isModalVisible: true
      flag: false
    };
  }

  getReceiver = (receiver, flag) => {

    console.log("receiver", receiver);
    let data = {
      sender: receiver,
      receiver: JSON.parse(localStorage.getItem("username"))
    };

    axios
      .post("http://localhost:5000/usermessages/updatetick", { ...data })
      .then(res => {
        this.setState({ receiver: receiver, flag: flag }, () => {
          console.log(this.state.flag);
        });
      });
  };

  handleGroupName = (groupId, groupName, flag) => {

    console.log("handlegroupname", groupId);
    this.setState(
      {
        receiver: groupName,
        flag: flag
      },
      () => {
        console.log(this.state.flag);
      }
    );
  };

  render() {
    return (
      <div className="home-page">
        <div className="online-home">

          <OnlineUsers
            getReceiver={(receiver, flag) => this.getReceiver(receiver, flag)}
            handleGroupName={(groupId, groupName, flag) => {
              this.handleGroupName(groupId, groupName, flag);
            }}
          />
        </div>
        <div className="chatboxed">

          <ChatBoxed receiver={this.state.receiver} flag={this.state.flag} />
        </div>
      </div>
    );
  }
}

export default withRouter(HomePage);
