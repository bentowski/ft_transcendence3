import { Component } from "react";
import {Link, Navigate} from "react-router-dom";
import io from "socket.io-client";
import Request from "./Requests";
import "../../styles/components/utils/userCards.css";
import { AuthContext } from "../../contexts/AuthProviderContext";
import { ChanType, PartiesType, UserType } from "../../types"
import ModalMatchWaiting from "./ModalMatchWaiting";
import ModalMatchInvite from "./ModalMatchInvite";

const socket = io("http://localhost:3000/update");

class UserCards extends Component<
  { user: any, avatar: any, stat: any },
  {
    login: string;
    id: number;
    online: string;
    ssname: string;
    ssid: string;
    chanId: string;
    socket: string;
    loaded: string;
  }
> {
  static contextType = AuthContext;
  constructor(props: any) {
    super(props);
    this.state = {
      login: "",
      id: props.user.auth_id,
      online: this.props.user.status ? "online" : "offline",
      ssname: "",
      ssid: "",
      chanId: "",
      loaded: '',
      socket: ''
    };
  }

  updateUser = (user: { auth_id: number, status: number }): void => {
    if (user.auth_id === this.state.id) {
      let str: string;
      if (user.status === 2)
        str = "in-game";
      else if (user.status === 1)
        str = "online";
      else
        str = "offline";
      this.setState({ online: str })
    }
  }

  setSocket = (): void => {
    if (this.state.loaded !== 'ok') {
      socket.on(('onUpdateUser'), (user: { auth_id: number, status: number }) => {
        this.updateUser(user);
      })
      this.setState({ loaded: 'ok' })
    }
  }

  getCurrentUser = (): UserType => {
    const ctx: any = this.context;
    return ctx.user;
  };

  checkIfChanExists = (title: string): boolean => {
    const ctx: any = this.context;
    const chans: ChanType[] = ctx.allChans;
    for (let index: number = 0; index < chans.length; index++) {
      if (title === chans[index].name) {
        return true;
      }
    }
    return false;
  }

  createChanName = (u1: UserType, u2: UserType): string => {
    let title: string = u1.username.slice(0, 3) + "-" + u2.username.slice(0, 3);
    let x: number = 0;
    while (this.checkIfChanExists(title)) {
      title = title + x.toString();
      x++;
    }
    return title;
  }

  createChan = async (): Promise<void> => {
    const ctx: any = this.context;
    try {
      let u2: UserType = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/name/" + this.state.login,
      )
      let newChan: ChanType = await Request(
        "POST",
        {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        {
          name: this.createChanName(ctx.user, u2),
          type: "direct",
          user_1_id: ctx.user.auth_id,
          user_2_id: u2.auth_id,
        },
        "http://localhost:3000/chan/createpriv"
      );
      // window.location.href = "http://localhost:8080/chat/"/*  + newChan.id */
    } catch (error) {
      ctx.setError(error);
    }

    /*
    let chans = await Request("GET", {}, {}, "http://localhost:3000/chan");
    const ctx: any = this.context;
    let u1 = undefined;
    let u2 = undefined;
    try {
      u1 = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/name/" + this.state.ssname
      );
      u2 = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/name/" + this.state.login
      );
    } catch (error) {
      ctx.setError(error);
    }
    let ret = 0;
    let x = 0;
    while (x < chans.length) {
      if (
        chans[x].type === "direct" &&
        ((chans[x].chanUser[0].auth_id === u1.auth_id &&
          chans[x].chanUser[1].auth_id === u2.auth_id) ||
          (chans[x].chanUser[0].auth_id === u2.auth_id &&
            chans[x].chanUser[1].auth_id === u1.auth_id))
      ) {
        ret = chans[x].id;
        break;
      }
      x++;
    }

    if (x === chans.length) {
      let newChan = await Request(
        "POST",
        {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        {
          name: this.createChanName(u1, u2),
          type: "direct",
          owner: u1.username,
          topic: u1.username + "$" + u2.username,
          admin: [u1.username, u2.username],
          password: "",
          chanUser: [u1, u2],
        },
        "http://localhost:3000/chan/create"
      );
      socket.emit("chanCreated");
      let newUrl = "http://localhost:8080/chat/#" + newChan.id;
      setTimeout(() => {
        window.location.href = newUrl;
      }, 100);
      return;
    }
    let newUrl = "http://localhost:8080/chat/#" + ret;
    window.location.href = newUrl;
     */
  };

  startNewGame = async (): Promise<void> => {
    const ctx: any = this.context;
    try {
      await Request(
        "POST",
        {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        {
          login: this.state.login,
          public: true
        },
        "http://localhost:3000/parties/create"
      );
    } catch (error) {
      ctx.setError(error);
    }
    socket.emit("askForGameUp", { "to": this.state.id, "from": this.getCurrentUser().auth_id })
    let modal: HTMLElement | null = document.getElementById('ModalMatchWaiting') as HTMLDivElement;
    modal.classList.remove('hidden');
    let parties: PartiesType[] = [];
    try {
      parties = await Request(
        'GET',
        {},
        {},
        "http://localhost:3000/parties/"
      )
    } catch (error) {
      ctx.setError(error);
    }
    let ids: number[] = parties.map((p: any) => {
      return p.id;
    })
    window.location.href = "http://localhost:8080/game/" + Math.max(...ids)
  }

  renderUserCards = (id: number): JSX.Element => {
    if (!this.props.stat) {
      if (this.props.avatar) {
        return (
          <div
            key={id}
            className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center"
          >
            <div className="col-5 h-100 overflow-hidden buttons">
              {/* <Link to={"/chat"}> */}
              <button className="p-1 btn btn-outline-dark shadow-none" onClick={this.createChan}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-chat-left-dots"
                  viewBox="0 0 16 16"
                >
                  <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
              </button>
              {/* </Link> */}
              <Link to={"/game"}>
                <button className="mx-2 p-1 btn btn-outline-dark shadow-none" onClick={this.startNewGame}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-joystick"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10 2a2 2 0 0 1-1.5 1.937v5.087c.863.083 1.5.377 1.5.726 0 .414-.895.75-2 .75s-2-.336-2-.75c0-.35.637-.643 1.5-.726V3.937A2 2 0 1 1 10 2z" />
                    <path d="M0 9.665v1.717a1 1 0 0 0 .553.894l6.553 3.277a2 2 0 0 0 1.788 0l6.553-3.277a1 1 0 0 0 .553-.894V9.665c0-.1-.06-.19-.152-.23L9.5 6.715v.993l5.227 2.178a.125.125 0 0 1 .001.23l-5.94 2.546a2 2 0 0 1-1.576 0l-5.94-2.546a.125.125 0 0 1 .001-.23L6.5 7.708l-.013-.988L.152 9.435a.25.25 0 0 0-.152.23z" />
                  </svg>
                </button>
              </Link>
            </div>
            <div className="col-2 d-flex flex-row d-flex justify-content-center">
              <input className={this.state.online} type="radio"></input>
            </div>
            <div className="col-5 d-flex flex-row justify-content-end align-items-center">
              <Link to={"/profil/" + this.state.login} className="mx-2">
                {this.state.login}
              </Link>
              <Link to={"/profil/" + this.state.login} className="mx-2">
                <img
                  alt=""
                  src={
                    "http://localhost:3000/user/" +
                    this.props.user.auth_id +
                    "/avatar"
                  }
                  className="miniAvatar"
                />
              </Link>
            </div>
          </div>
        );
      }

      return (
        <div key={id} className="friendsDiv row my-2">
          <div className="col-6">
            <input className={this.state.online} type="radio"></input>
          </div>
          <div className="col-6 row">
            <a href={"/profil/" + this.state.login} className="col-12">{this.state.login}</a>
          </div>
        </div>
      );
    }

    return (
      <div
        key={id}
        className="friendsDiv col-11 mr-2 d-flex flex-row align-items-center"
      >
        <div className="col-3 d-flex flex-row justify-content-start align-items-center">
          <Link to={"/profil/" + this.state.login} className="mx-2">
            <img
              alt=""
              src={
                "http://localhost:3000/user/" +
                this.props.user.auth_id +
                "/avatar"
              }
              className="miniAvatar"
            />
          </Link>
          <Link to={"/profil/" + this.state.login} className="mx-2">
            {this.state.login}
          </Link>
        </div>
        <div className="Score col-9 d-flex justify-content-between align-items-center">
          <div className="">won</div>
          <div className="Ratio mx-2 p-1 d-flex flex-row align-items-center">
            <div className="Rwon col-6 px-2 d-flex justify-content-start align-items-center">{this.props.user.game_won}</div>
            <div className="col-6 px-2 d-flex justify-content-end">{this.props.user.game_lost}</div>
          </div>
          <div className="">lost</div>
        </div>
      </div>
    );
  };

  openInvite = (body: { "to": string, "from": string }): void => {
    if (body.to === this.getCurrentUser().auth_id) {
      let modal: HTMLElement | null = document.getElementById("ModalMatchInvite" + this.state.login) as HTMLDivElement;
      modal.classList.remove('hidden')
    }
  }

  closeInvite = (body: { "to": string, "from": string }): void => {
    console.log("close !")
    if (body.to === this.getCurrentUser().auth_id) {
      let modal: HTMLElement | null = document.getElementById('ModalMatchInvite' + this.state.login) as HTMLDivElement;
      modal.classList.add('hidden')
    }
  }

  initSocket = (): void => {
    if (this.state.socket !== "on") {
      this.setState({ socket: 'on' });
      socket.on("onAskForGameUp", (body: { "to": string, "from": string }) => {
        this.openInvite(body);
      });
      socket.on("onAskForGameDown", (body: { "to": string, "from": string }) => {
        this.closeInvite(body);
      });
      socket.on("onInviteAccepted", (body: { "to": string, "from": string, "partyID": string }) => {
        if (body.to === this.getCurrentUser().auth_id)
          window.location.href = "http://localhost:8080/game/" + body.partyID;
      });
      socket.on("onInviteDeclined", (body: { "to": string, "from": string }) => {
        if (body.to === this.getCurrentUser().auth_id) {
          let modal = document.getElementById('ModalMatchWaiting') as HTMLDivElement;
          modal.classList.add('hidden');
        }
        // console.log("LETS NOT CONNECT !") ///////////////
      });
    }
  }

  /*
  callback = (status: string) => {
    if (status === "accepted") {
      // socket.emit
    }
    else if (status === "declined") {

    }
  }
   */

  componentDidMount = async (): Promise<void> => {
    const ctx: any = this.context;
    let user: UserType | undefined = undefined;
    try {
      user = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/id/" + this.state.id
      );
    } catch (error) {
      ctx.setError(error);
    }
    let status: string = "offline";
    if (user) {
      if (user.status === 1) {
        status = "online";
      }
      this.setState({ login: user.username, online: status });
    }
    this.setState({ ssid: this.getCurrentUser().auth_id });
    this.setState({ ssname: this.getCurrentUser().username });
    this.initSocket();
    this.setSocket();
  };

  render(): JSX.Element {
    let items: JSX.Element = this.renderUserCards(1);
    return (
      <div
        key={(this.state.id * 5) / 3}
        className="col-12 my-2 d-flex flex-row justify-content-between"
      >
        <ModalMatchWaiting title="Waiting for opponent" calledBy="UserCards" hidden user={this.props.user} />
        <ModalMatchInvite title="Invitation" calledBy="UserCards" user={this.props.user} />
        {items}
      </div>
    );
  }
}

export default UserCards;
