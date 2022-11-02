import { Component } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Switch from "./utils/Switch";
import {useAuthData} from "../contexts/AuthProviderContext"
// import Request from "./utils/Requests"
// import "./Menu.css"

const LogoutSession = () => {
  const { setIsAuth, setUser, setIsToken, setIsTwoFa } = useAuthData();
  const navigate = useNavigate();
  //console.log("loging out");
  fetch("http://localhost:3000/auth/logout", {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      //console.log("response logout = ", data);
      if (data.status === 200) {
        console.log("yey");
        setUser(undefined);
        setIsAuth(false);
        setIsToken(false);
        setIsTwoFa(false);
        //console.log("navigating");
        navigate("/login");
      }
    })
    .catch((error) => {
      console.log("some shit happened");
    });
}

class Menu extends Component {
  state = {
    username: "",
    avatar: "",
  };

  componentDidMount = () => {
    let newUser: any = sessionStorage.getItem("data");
    // console.log("newUser = " + newUser);
    if (newUser) {
      newUser = JSON.parse(newUser);
      this.setState({ avatar: newUser.user.avatar });
      this.setState({ username: newUser.user.username });
    }
  };

  render() {
    const user = sessionStorage.getItem("username");
    return (
        <div className="Menu d-flex justify-content-between align-items-center">
          <div className="homeButtonDiv col-3 d-flex justify-content-start">
            <Link to={"/tchat"}>
              <p className="m-0">chat</p>
            </Link>
            <Link to={"/history"}>
              <p className="m-0 mx-2">history</p>
            </Link>
          </div>{" "}
          {/* homeButtonDiv */}
          <div className="titleDiv">
            <h1 className="m-0">PONG</h1>
          </div>{" "}
          {/* titleDiv */}
          <div className="profilMenu d-flex justify-content-end align-items-center col-3">
            <div className="twoFASwitch">
              <Switch />
            </div>
            <div className="loginMenu px-2">
              <Link to={"/profil/" + this.state.username}>
                <p className="m-0">{this.state.username}</p>
              </Link>
            </div>
            <div className="avatarMenu">
              <Link to={"/profil/" + this.state.username}>
                <img
                    className="miniAvatar"
                    width="150"
                    height="150"
                    src={this.state.avatar}
                    alt=""
                />
              </Link>
            </div>
            <div className="logoutMenu">
              <Link onClick={LogoutSession} to={"/login"}>
                <p className="m-0">logout</p>
              </Link>
            </div>
          </div>{" "}
          {/*profilMenu */}
        </div> //Menu
    ); // fin de return
  } // fin de render
} // fin de App

export default Menu;
