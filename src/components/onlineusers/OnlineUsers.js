import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "./OnlineUsers.css";
import Modal from "../modal/modal";


class OnlineUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onlineUsers: [],
      showGroup: false,
      groupname: "",
      groups: []
    };
  }

  componentDidMount = () => {
    axios.get("http://localhost:5000/userroute/onlineusers").then(res => {
      console.log("result", [...res.data]);
      this.setState(
        {
          onlineUsers: [...res.data]
        },
        () => {
          console.log("callback", this.state.onlineUsers);
        }
      );
    });

    axios.get("http://localhost:5000/group/getgroup").then(res => {
      console.log(res.data.rows);
      this.setState(
        {
          groups: [...res.data.rows]
        },
        () => {
          console.log("groups", this.state.groups);
        }
      );
    });
  };

  group = () => {
    console.log("group");
    this.setState({
      showGroup: true
    });

  };



  saveGroupName = groupName => {
    console.log("onlineusers", groupName);


    this.setState(
      {
        groupname: groupName
      },
      () => {
        let data = {
          groupName: this.state.groupname
        };

        console.log("axios", data);

        axios
          .post("http://localhost:5000/group/group", { ...data })
          .then(res => {
            console.log(res);
            axios.get("http://localhost:5000/group/getgroup").then(res => {
              console.log(res.data.rows);
              this.setState(
                {
                  groups: [...res.data.rows]
                },
                () => {
                  console.log("groups", this.state.groups);
                }
              );
            });
          });
        console.log("setstate", this.state.groupname);
      }
    );
  };

  close = () => {
    console.log("close");
    this.setState({
      showGroup: false
    });
  };

  render() {
    const { onlineUsers } = this.state;
    let currentUser = JSON.parse(localStorage.getItem("username"));
    console.log("renders", onlineUsers, currentUser);
    const { showGroup } = this.state;
    return (
      <div className="parent-online">
        <div className="parent-d">
          <div className="img">
            <img
              className="img-div"
              src={process.env.PUBLIC_URL + "/slack-logo.png"}
            />
          </div>
          <div className="div-h1">
            <h3 className="h1-t">CHATGRAM</h3>
          </div>
        </div>
        <div className="online">
          <div className="header">
            <b className="bold">Direct Messages</b>
          </div>
          {onlineUsers.map((users, index) =>
            currentUser !== users.email ? (
              <div
                className="child-online"
                onClick={() => {
                  this.props.getReceiver(users.email, true);
                }}
                key={index}
                style={{ cursor: "pointer" }}
              >
                <i class="fas fa-circle"></i>
                <em className="em">{users.nickname}</em>
              </div>
            ) : (
                ""
              )
          )}
        </div>

        <div className="channel-div">
          <div className="channel-child">
            <div>
              <b className="channel-b">channel</b>
            </div>
            <div style={{ cursor: "pointer" }}>
              <i class="fas fa-plus-circle" onClick={this.group}></i>
            </div>
          </div>

          <div className="g-name">
            {this.state.groups.map(group => (
              <div
                onClick={() =>
                  this.props.handleGroupName(
                    group.group_id,
                    group.group_name,
                    false
                  )
                }
                style={{ cursor: "pointer" }}
              >
                {"#"}
                {group.group_name}
              </div>
            ))}
          </div>
        </div>
        {showGroup && (
          <Modal
            open={showGroup}
            saveGroupName={groupName => {
              this.saveGroupName(groupName);
            }}
            close={() => this.close()}
          />
        )}
      </div>
    );
  }
}

export default withRouter(OnlineUsers);
