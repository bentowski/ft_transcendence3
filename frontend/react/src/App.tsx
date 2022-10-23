import { Component } from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Game from "./pages/Game";
import Page from "./pages/Page";
import Login from "./pages/Login";
import Profil from "./components/Profil";
import Tchat from "./components/Tchat";
import History from "./components/History";
import { getCookies } from "./components/utils/GetCookies";
import jwt_decode from "jwt-decode";
import Request from "./components/utils/Requests";
//import axios from "axios";
//import Cookies from "js-cookie";

class App extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      currentUser: undefined,
    };
  }

  async getCurrentUser() {
    let user = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/user/current"
    );
    if (!user) {
      return;
    }
    const data = {
      user: {
        auth_id: user.auth_id,
        user_id: user.user_id,
        avatar: "https://avatars.dicebear.com/api/personas/" + 36 + ".svg",
        // avatar: user.avatar,
        username: user.username,
      },
    };
    sessionStorage.setItem("data", JSON.stringify(data));
    return data;
  }

  componentDidMount = async () => {
    const user = this.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  };

  render() {
    return (
      <div>
        <Routes>
          <Route path="/" element={<Page />}>
            <Route path="/profil" element={<Profil />} />
            <Route path="/tchat" element={<Tchat />} />
            <Route path="/history" element={<History />} />
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
