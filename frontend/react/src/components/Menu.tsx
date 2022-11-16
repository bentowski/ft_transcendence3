import { Link, useNavigate } from "react-router-dom";
import Switch from "./utils/Switch";
import { useAuthData } from "../contexts/AuthProviderContext";
import {useEffect, useState} from "react";

const Menu = () => {
  const { user, userAuthentication, updateUserList } = useAuthData();
  const [username, setUsername] = useState<string>(user.username);
  const [avatarUrl, setAvatarUrl] = useState({url:'',hash:0});
  const navigate = useNavigate();

  useEffect(() => {
    if (user.username) {
      setUsername(user.username);
    }
    if (user.avatar) {
      setAvatarUrl({url: 'http://localhost:3000/user/' + user.auth_id + '/avatar', hash: Date.now()});
    }
  }, [user])

  const logoutSession = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          userAuthentication(false);
          //navigate("/login")
          return ;
        }
      })
      .catch((error) => {
        console.log("some shit happened");
        userAuthentication(false);
        //navigate("/login")
        return ;
      });
      //window.location.reload()

  };
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
          <Link to={"/profil/" + username}>
            <p className="m-0">{username}</p>
          </Link>
        </div>
        <div className="avatarMenu">
          <Link to={"/profil/" + username}>
            <img
                className="miniAvatar"
                width="150"
                height="150"
                src={`${avatarUrl.url}?${avatarUrl.hash}`}
                alt=""
            />
          </Link>
        </div>
        <div className="logoutMenu">
          <button onClick={logoutSession}>
            <p className="m-0">logout</p>
          </button>
        </div>
      </div>{" "}
      {/*profilMenu */}
    </div> //Menu
  ); // fin de return
  //} // fin de render
}; // fin de App

export default Menu;
