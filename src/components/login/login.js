import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import "./login.css";
import socket from "socket.io-client";

class Login extends Component {
  constructor(props) {
    super(props);
    let io = socket.connect("http://localhost:5000");
    this.state = {
      email: "",
      nickname: "",
      password: "",
      io
    };
  }

  handleChange = event => {
    console.log("handlechange");

    this.setState({
      [event.target.name]: event.target.value
    });
  };

  login = event => {
    event.preventDefault();

    const { email, password } = this.state;

    let loginUserData = {
      email: email,
      password: password
    };

    console.log({ ...loginUserData });

    axios
      .put("http://localhost:5000/userroute/loginflag", { ...loginUserData })
      .then(res => {
        console.log("res", res);
        if (res.data.rowCount == 0) {
          this.setState(
            {
              email: "",
              password: ""
            },
            () => {
              this.props.history.push("/homepage");
              // alert("logged in")
            }
          );
        } else {
          localStorage.setItem("username", JSON.stringify(email));
          this.props.history.push("/homepage/");
        }
      });

    // this.state.io.emit("login", { user: this.state.email });
  };

  signUp = () => {
    this.props.history.push("/signup");
  };

  render() {
    const { email, nickname, password } = this.state;

    return (
      <div className="login-parent">
        <form onSubmit={this.login} className="form-div ">
          <div className="form-div">
            <div className="form-child">
              <input
                classname="input"
                type="text"
                placeholder="enter email"
                name="email"
                value={email}
                onChange={this.handleChange}
              ></input>
            </div>
            <div className="form-child">
              <input
                type="password"
                classname="input"
                placeholder="enter password"
                name="password"
                value={password}
                onChange={this.handleChange}
              ></input>
            </div>
            <div className="form-child">
              <input type="submit" value="login"></input>
            </div>
            <div>
              <button onClick={this.signUp} className="btn-login">
                signup
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
