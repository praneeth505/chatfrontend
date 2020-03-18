import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/login/login";
import OnlineUsers from "./components/onlineusers/OnlineUsers";
import ChatBoxed from "./components/chatpage/ChatBoxs";
import SignUp from "./components/signup/SignUp";
import "./App.css";
// import TransitionsModal from "./components/groups/GroupName";
import HomePage from "./components/home/HomePage";

function App() {
  return (
    <div className="main-div">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Login />
          </Route>
          <Route path="/homepage" exact>
            <HomePage />
          </Route>

          <Route path="/signup" exact>
            <SignUp />
          </Route>
          <Route path="/groupname" exact>
            {/* <TransitionsModal /> */}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
