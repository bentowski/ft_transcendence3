import { Link, useNavigate } from "react-router-dom";
import Switch from "./utils/Switch";
import { useAuthData } from "../contexts/AuthProviderContext";
// import Request from "./utils/Requests"
// import "./Menu.css"

const Menu = () => {
  const { user, setIsAuth, setUser, setIsToken, setIsTwoFa } = useAuthData();
  const navigate = useNavigate();

  const logoutSession = () => {
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
          //console.log("yey");
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
          <Link to={"/profil/" + user.username}>
            <p className="m-0">{user.username}</p>
          </Link>
        </div>
        <div className="avatarMenu">
          <Link to={"/profil/" + user.username}>
            <img
              className="miniAvatar"
              width="150"
              height="150"
              src={"http://localhost:3000/user/" + user.auth_id + "/avatar"}
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
