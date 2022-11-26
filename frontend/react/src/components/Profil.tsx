import {Component, useCallback} from "react";
import {Link, NavigateFunction} from "react-router-dom";
import Request from "./utils/Requests";
import HistoryCards from "./utils/HistoryCards";
import GetAvatar from "./utils/GetAvatar";
import "../styles/components/profil.css";
import ModalChangeUsername from "./utils/ModalChangeUsername";
import { MessagePayload, ChanType, UserType } from "../types"
import { AuthContext } from "../contexts/AuthProviderContext";
import BlockUnBlock from "./utils/BlockUnBlock";
import FriendUnFriend from "./utils/FriendUnFriend";
import ModalChangeAvatar from "./utils/ModalChangeAvatar";
import Switch from "./utils/Switch";

class Profil extends Component<
    {
      nav: NavigateFunction,
      loc: any
    },
    {
      user: any;
      current_username: string;
      histories: Array<any>;
      rank: number;
      local: string,
    }
    > {
  static contextType = AuthContext;
  constructor(props: any) {
    super(props);
    this.state = {
      user: {},
      current_username: "",
      histories: [],
      rank: 0,
      local: '',
    };
  }

  getUser = async (username: string) => {
    if (!username) {
      username = this.state.current_username;
    }
    try {
      let newUser = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/name/" + username
      );
      this.setState({ user: newUser });
    } catch (error) {
      const ctx: any = this.context;
      ctx.setError(error);
    }
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
    console.log("user = ", this.state.user)
    console.log("hist = ", this.state.histories)
    let users: any = await Request("GET", {}, {}, "http://localhost:3000/user");
    if (!users) return;
    users.sort(function (a: UserType, b: UserType) {
      return a.game_lost - b.game_lost;
    });
    users.sort(function (a: UserType, b: UserType) {
      return b.game_won - a.game_won;
    });
    let x = 0;
    while (x < users.length && users[x].auth_id !== this.state.user.auth_id) x++;
    this.setState({ rank: x + 1 });
  };

  componentDidUpdate(
      prevProps: Readonly<{
          nav: NavigateFunction,
          loc: any,
      }>,
      prevState: Readonly<{
        user: any;
        current_username: string;
        histories: Array<any>;
        rank: number;
        local: string }>,
      snapshot?: any) {
    let url = document.URL;
    if (document.URL === "http://localhost:8080" || document.URL === "http://localhost:8080/") {
      window.location.href = "http://localhost:8080/profil/" + this.state.user.username
    }
    const newLoc: string = url.substring(url.lastIndexOf("/") + 1);
    if (newLoc !== this.state.local || prevState.local !== newLoc) {
      this.getUser(newLoc);
      this.getHistory();
      this.getRank();
      this.setState({ local: newLoc });
    }
  }

  componentDidMount = () => {
    const cxt: any = this.context;
    const usr = cxt.user;
    this.setState({ user: JSON.stringify(usr) });
    this.setState({ current_username: usr.username });
    this.setState({ local: this.props.loc });
    let url = document.URL;
    if (document.URL === "http://localhost:8080" || document.URL === "http://localhost:8080/") {
      window.location.href = "http://localhost:8080/profil/" + cxt.user.username
    }
    const newUrl: string = url.substring(url.lastIndexOf("/") + 1);
    if (url !== this.state.local) {
      this.getUser(newUrl);
      this.getHistory();
      this.getRank();
      this.setState({ local: newUrl });
    }
  }

  printHeader = () => {
    const ctx: any = this.context;
    const user: UserType = ctx.user;
    if (this.state.user.auth_id === user.auth_id) {
      return (
          <div className="ProfilHeader">
            <div className="Avatar d-flex flex-row justify-content-start">
              <div className="avatar">
                <ModalChangeAvatar />
              </div>
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
            <ModalChangeUsername />
            <div className="twoFASwitch d-flex flex-row justify-content-start">
              <Switch />
            </div>
          </div>
      );
    } else {
      if (this.state.user.auth_id !== undefined) {
        return (
            <div className="ProfilHeader">
              <img
                  className="modifAvatar mb-2"
                  alt="prout"
                  width={100}
                  height={100}
                  src={"http://localhost:3000/user/" + this.state.user.auth_id + "/avatar"} />
              <h3>{this.state.user.username}</h3>
              <BlockUnBlock auth_id={this.state.user.auth_id}/>
              <FriendUnFriend auth_id={this.state.user.auth_id}/>
            </div>
        );
      } else {
        return <p>caca</p>
      }
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
        </div>
    );
  }
}

export default Profil;