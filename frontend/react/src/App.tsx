import { Component } from "react";
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

class App extends Component {
  constructor(props: any) {
    super(props)
  //check global state
    this.state = {
      isAuth: false,
      currentUser: undefined,
    }
  }

  getCurrentUser() {
    const access_token = getCookies("jwt");
    const decoded = jwt_decode(access_token);
    const string = JSON.stringify(decoded);
    const user = JSON.parse(string);
    const data = {
      user: {
        auth_id: user.auth_id,
        user_id: user.user_id,
        avatar: user.avatar,
        username: user.username,
      }
    };
    sessionStorage.setItem("data", JSON.stringify(data));
    return data;
  }

  componentDidMount = async () => {
    const user = this.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        isAuth: true,
      });
    }
  };

  render() {
    // const { currentUser, isAuth } = this.state;
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
