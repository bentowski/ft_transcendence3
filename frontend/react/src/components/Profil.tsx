import { Component, Context } from "react";
import { Link, NavigateFunction } from "react-router-dom";
import Request from "./utils/Requests";
import HistoryCards from "./utils/HistoryCards";
import "../styles/components/profil.css";
import ModalChangeUsername from "./utils/ModalChangeUsername";
import { HistoryType, UserType } from "../types"
import { AuthContext } from "../contexts/AuthProviderContext";
import BlockUnBlock from "./utils/BlockUnBlock";
import FriendUnFriend from "./utils/FriendUnFriend";
import ModalChangeAvatar from "./utils/ModalChangeAvatar";
import Switch from "./utils/Switch";

class Profil extends Component<
    {
      nav: NavigateFunction,
      loc: any,
      parentCallback: (newurl: string) => void
    },
    {
      user: any;
      current_username: string;
      histories: Array<any>;
      rank: number;
      local: string,
    }
    > {
  static contextType = AuthContext
  constructor(props: any, context: any) {
    super(props, context);
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
    if (username === undefined) {
      return ;
    }
    try {
      let newUser: UserType = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/name/" + username
      );
      this.setState({ user: newUser });
      this.setState({ current_username: username })
    } catch (error) {
      const ctx: any = this.context;
      const usr: UserType = ctx.user
      this.props.nav("/profil/" + usr.username)
      ctx.setError(error);
    }
  };

  getHistory = async () => {
    const ctx: any = this.context;
    let histories: HistoryType[] = [];
    try {
      histories = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/parties/histories/all"
      );
    } catch (error) {
      ctx.setError(error);
    }
    this.setState({ histories: histories });
  };

  getRank = async () => {
    const ctx: any = this.context;
    let users: UserType[] = [];
    try {
      users = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user"
      );
    } catch (error) {
      ctx.setError(error);
    }
    users.sort(function (a: UserType, b: UserType) {
      return a.game_lost - b.game_lost;
    });
    users.sort(function (a: UserType, b: UserType) {
      return b.game_won - a.game_won;
    });
    let x: number = 0;
    while (x < users.length && users[x].auth_id !== this.state.user.auth_id) {
      x++;
    }
    this.setState({ rank: x + 1 });
  };

  async componentDidUpdate(
      prevProps: Readonly<{
          nav: NavigateFunction,
          loc: any,
          parentCallback: (newurl: string) => void,
      }>,
      prevState: Readonly<{
        user: any;
        current_username: string;
        histories: Array<any>;
        rank: number;
        local: string }>,
      snapshot?: any) {
    const ctx: any = this.context;
    let url: string = this.props.loc.pathname;
    const newLoc: string = url.substring(url.lastIndexOf("/") + 1);
    if (newLoc !== 'undefined' && (newLoc !== this.state.local || prevState.local !== newLoc)) {
      this.getUser(newLoc);
      this.getHistory();
      this.getRank();
      this.setState({ local: newLoc });
    }
    /*
    if (prevState.current_username !== ctx.user.username) {
      this.setState({current_username: ctx.user.username});
      this.props.nav("/profil/" + ctx.user.username)
    }
     */
  }

  componentDidMount = async () => {
    const cxt: any = this.context;
    const usr: UserType = cxt.user;
    this.setState({ user: usr });
    this.setState({ current_username: usr.username });
    if (document.URL === "http://localhost:8080" || document.URL === "http://localhost:8080/") {
      this.props.nav("/profil/" + usr.username);
    }
    let url: string = this.props.loc.pathname;
    const newUrl: string = url.substring(url.lastIndexOf("/") + 1);
    if (newUrl !== this.state.local) {
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
        <div className="ProfilHeader col-6">
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
          <div className="ProfilHeader col-6">
            <img
              className="modifAvatar mb-2"
              alt="prout"
              width={100}
              height={100}
              src={"http://localhost:3000/user/" + this.state.user.auth_id + "/avatar"} />
            <h3>{this.state.user.username}</h3>
            <BlockUnBlock auth_id={this.state.user.auth_id} />
            <FriendUnFriend auth_id={this.state.user.auth_id} />
          </div>
        );
      } else {
        return <p>caca</p>
      }
    }
  };

  render(): JSX.Element {
    let histories: JSX.Element[] = [];
    let i: number = this.state.histories.length - 1;
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
        <div className="divProfilStats col-12 d-flex flex-row">
          {this.printHeader()}
          <div className="StatsRank col-6">
            <div className="Stats">
              <h3 className="d-flex justify-content-start">Stats</h3>
              <div className="Score">
                <div className="scoreHeader col-12 d-flex flex-row">
                  <div className="col-6 d-flex justify-content-start">won</div>
                  <div className="col-6 d-flex justify-content-end">lost</div>
                </div>
                <div className="Ratio p-1 d-flex flex-row align-items-center">
                  <div className="Rwon col-6 px-2 d-flex justify-content-start align-items-center">{this.state.user.game_won}</div>
                  <div className="col-6 px-2 d-flex justify-content-end">{this.state.user.game_lost}</div>
                </div>
              </div>
            </div>
            <div className="Rank mt-4 d-flex flex-row">
              <h3>Rank</h3>
              <Link to={"/history"}>
                <h3 className="rankNumber mx-3">{this.state.rank}</h3>
              </Link>
            </div>
          </div>
        </div>
        <div className=" mt-5">
          <h3 className="d-flex justify-content-start">History</h3>
          {histories}
        </div>
      </div>
    );
  }
}

export default Profil;
