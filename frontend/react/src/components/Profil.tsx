import { Component } from "react";
import { Link } from "react-router-dom";
import Request from "./utils/Requests";
import HistoryCards from "./utils/HistoryCards";
import GetAvatar from "./utils/GetAvatar";
import "../styles/components/profil.css";
import ModalChangeUsername from "./utils/ModalChangeUsername";
import { MessagePayload, ChanType, UserType } from "../types"
import { AuthContext } from "../contexts/AuthProviderContext";

class Profil extends Component<
  {},
  {
    user: any;
    histories: Array<any>;
    rank: number;
    location: string;
    show: boolean;
  }
> {
  static contextType = AuthContext;
  constructor(props: any) {
    super(props);
    this.state = {
      user: {},
      histories: [],
      rank: 0,
      location: "",
      show: false,
    };
  }

  changeShowing = (newState: boolean) => {
    this.setState({ show: newState });
  };

  getUser = async (username: string) => {
    let currentUser: any = sessionStorage.getItem("data");
    currentUser = JSON.parse(currentUser);
    if (!username) {
      username = currentUser.user.username;
    }
    let newUser = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/user/name/" + username
    );
    if (!newUser)
    {
        username = currentUser.user.username;
        newUser = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/name/" + username
        );
    };
    // console.log(newUser)
    this.setState({ user: newUser });
  };

  getHistory = async () => {
    let histories = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/parties/histories/all"
    );
    if (!histories) return;
    this.setState({ histories: histories });
  };

  getRank = async () => {
    let users: any = await Request("GET", {}, {}, "http://localhost:3000/user");
    if (!users) return;
    users.sort(function (a: UserType, b: UserType) {
      return a.game_lost - b.game_lost;
    });
    users.sort(function (a: UserType, b: UserType) {
      return b.game_won - a.game_won;
    });
    let x = 0;
    while (x < users.length && users[x].auth_id != this.state.user.auth_id) x++;
    this.setState({ rank: x + 1 });
  };

  componentDidMount = () => {
    const cxt: any = this.context;
    this.setState({ user: JSON.stringify(cxt.user) });
    let test = setInterval(() => {
      let url = document.URL;
      if (document.URL === "http://localhost:8080" || document.URL === "http://localhost:8080/")
        window.location.href = "http://localhost:8080/profil/" + this.state.user.username
      if (!document.URL.includes("localhost:8080/profil"))
        clearInterval(test);
      url = url.substring(url.lastIndexOf("/") + 1);
      if (url !== this.state.location) {
        this.getUser(url);
        this.getHistory();
        this.getRank();
        this.setState({ location: url });
      }
    }, 10);
  };

  printHeader = () => {
    const ctx: any = this.context;
    const user: UserType = ctx.user;
    if (this.state.user.auth_id === user.auth_id) {
      return (
        <div className="ProfilHeader">
          <div className="Avatar d-flex flex-row justify-content-start">
            <GetAvatar
              className="modifAvatar mb-2"
              width="100"
              height="100"
              alt=""
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pencil-fill mx-2"
              viewBox="0 0 16 16"
            >
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
            </svg>
          </div>
          <a
            onClick={() => this.setState({ show: true })}
            className="d-flex flex-row justify-content-start align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#changeName"
          >
            <h3>{this.state.user.username}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pencil-fill mx-2"
              viewBox="0 0 16 16"
            >
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
            </svg>
          </a>
          {/*
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
            />
            2fa
          </div>
            <div className="logoutMenu ml-1">
            <Link to={"/login"}>
              <p className="m-0">logout</p>
            </Link>
          </div>*/}
        </div>
      );
    } else {
      return (
        <div className="ProfilHeader">
          <h3>{this.state.user.username}</h3>
        </div>
      );
    }
  };

  render() {
    let histories: Array<any> = [];
    let i = this.state.histories.length - 1;
    while (i >= 0) {
      if (
        this.state.histories[i].user_one === this.state.user.username ||
        this.state.histories[i].user_two === this.state.user.username
      )
        histories.push(
          <HistoryCards
            history={this.state.histories[i]}
            profil={this.state.user.username}
          />
        );
      i--;
    }
    return (
      <div className="Profil">
        {this.printHeader()}
        <div className="Stats mt-5">
          <h3>Stats</h3>
          <div className="Score col-9 d-flex justify-content-between align-items-center">
            <div className="">won</div>
            <div className="Ratio mx-2 d-flex flex-row justify-content-between align-items-center">
              <div className="Rwon col-6">{this.state.user.game_won}</div>
              <div className="col-6">{this.state.user.game_lost}</div>
            </div>
            <div className="">lost</div>
          </div>
        </div>
        <div className="Rank">
          <h3>Rank </h3>
          <Link to={"/history"}>
            <h3>{this.state.rank}</h3>
          </Link>
        </div>
        <div className=" mt-5">
          <h3>History</h3>
          {histories}
        </div>
        <ModalChangeUsername
          show={this.state.show}
          parentCallBack={this.changeShowing}
        />
      </div>
    );
  }
}

export default Profil;
