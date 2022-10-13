import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Game from "./pages/Game";
import Page from "./pages/Page";
import Login from "./pages/Login";
import Profil from "./components/Profil";
import Tchat from "./components/Tchat";
import { getCookies } from "./components/utils/GetCookies";
import jwt_decode from "jwt-decode";
//import Request from "./components/utils/Requests";
//import axios from "axios";
//import Cookies from "js-cookie";

class App extends React.Component {
  access_token = getCookies("jwt");
  //check global state
  state = {
    //username: Cookies.get("auth_id"),
  };

  /*
  getCookie = () => {
    axios
      .get("http://localhost:3000/auth/redirect", { withCredentials: true })
      .then((res) => {
        const token = res.data.token;
        const user = jwt(token);
        sessionStorage.setItem("token", token);
      });
  };
  */

  /*
  getCurrentUser = () => {
    //const [isAuth, setIsAuth] = React.useState(false);
    let user = Request("GET", {}, {}, "http://localhost:3000/user/current");
  };
  */

  componentDidMount = async () => {
    const decoded = jwt_decode(this.access_token);
    const string = JSON.stringify(decoded);
    const user = JSON.parse(string);
    const data = {
      auth_id: user.auth_id,
      user_id: user.user_id,
      avatar: user.avatar,
      username: user.username,
    };
    sessionStorage.setItem("data", JSON.stringify(data));
  };

  render() {
    return (
      <div>
        <Routes>
          <Route path="/" element={<Page />}>
            <Route path="/profil" element={<Profil />} />
            <Route path="/tchat" element={<Tchat />} />
            <Route path="/*" element={<Profil />} />
            <Route path="/" element={<Profil />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default App;
