import { Component } from "react";
import io from "socket.io-client";
import Request from "./Requests";
import "../../styles/components/utils/modal.css";
import { AuthContext } from "../../contexts/AuthProviderContext";
import { ChanType, UserType } from "../../types"

const socket = io("http://localhost:3000/chat");

class Modal extends Component<
  {
    title: string;
    calledBy: string;
    userChan?: Array<UserType>;
    parentCallBack?: any;
    chans: Array<ChanType>;
  },
  { user: any; friends: Array<UserType>; input: string; allChans: Array<ChanType>; fieldName: string; errName: string;
  fieldPass: string;  errPass: string }
> {
  static context = AuthContext;
  constructor(props: any) {
    super(props);
    this.state = {
      user: {
        user_id: 0,
        auth_id: 0,
        avatar: "",
        username: "",
      },
      friends: [],
      input: "",
      allChans: [],
      fieldName: "",
      errName: "",
      fieldPass: "",
      errPass: "",
    };
  }

  handleName = (evt: any) => {
    evt.preventDefault();
    this.setState({ fieldName: evt.target.value });
  };

  handlePass = (evt: any) => {
    evt.preventDefault();
    this.setState({ fieldPass: evt.target.value });
  };

  hidden = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.add("hidden");
    // login.value = "";
  };

  getCurrentUser = () => {
    const ctx: any = this.context;
    return ctx.user;
  };

  componentDidMount = async () => {
    let newUser: any = sessionStorage.getItem("data");
    // console.log(newUser);
    if (newUser) {
      newUser = JSON.parse(newUser);
      this.setState({ user: newUser.user });
    }
    let friends: Array<UserType> = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/user/"
    );
    if (!friends) return;
    let allChans: Array<ChanType> = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/chan"
    );
    if (!allChans) return;
    this.setState({ friends: friends, allChans: allChans });
  };

  verifName = () => {
    // let chans = getChans();
    var regex = /^[\w-]+$/
    var max = /^.{1,10}$/
    if (!regex.test(this.state.fieldName)) {
      this.setState({ errName: "Non valid character" })
      return false;
    }
    else if (!max.test(this.state.fieldName)) {
      this.setState({ errName: "Too long (10 max)" })
      return false;
    }
    else if (this.state.allChans.findIndex((u: any) => u.name === this.state.fieldName) > -1) {
      this.setState({ errName: "This name already exists" })
      return false;
    }
    return true;
  }

  verifPass = () => {
    var regex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    // var regex = /^[\w-]+$/
    // var max = /^.{1,10}$/
    if (!regex.test(this.state.fieldPass)) {
      this.setState({ errPass: "alphanum 6 min" })
      return false;
    }
    return true;
  }

  verifField = () => {
    let r1 = this.verifName();
    let r2 = this.verifPass();
  
    if (!r1 || !r2)
      return false;
    return true;
  }

  createChan = async () => {
    // if (this.state.fieldName === "") {
    if (this.verifField()) {
      this.props.parentCallBack.createChannel()
      this.hidden()
    }
  };

  displayUser = (id: number, user: UserType) => {
    return (
      <div
        key={id}
        className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center"
      >
        <div className="col-5 h-100 overflow-hidden buttons">
          <button
            onClick={() =>
              this.props.parentCallBack.socket.emit("addToChannel", {
                room: this.props.parentCallBack.room,
                auth_id: user.auth_id,
              })
            }
          >
            ADD
          </button>
        </div>
        <div className="col-2 d-flex flex-row d-flex justify-content-center">
          <input
            className={user.status ? "online" : "offline"}
            type="radio"
          ></input>
        </div>
        <div className="col-5 d-flex flex-row justify-content-end align-items-center">
          <a href={"/profil/#" + user.username} className="mx-2">
            {user.username}
          </a>
          <img
            src={user.avatar}
            className="miniAvatar"
            width={150}
            height={150}
          />
        </div>
      </div>
    );
  };

  users = () => {
    let friends: Array<any> = [];
    let isUsers: boolean = false;
    let x: number = 0;
    if (this.state.friends.length > 0) {
      let chanUser: Array<UserType> | undefined = this.props.userChan;
      while (
        chanUser?.length &&
        chanUser?.length > 0 &&
        x < this.state.friends.length
      ) {
        let friend: UserType = this.state.friends[x];
        if (!chanUser.find((user) => user.auth_id === friend.auth_id)) {
          isUsers = true;
          if (
            this.state.input.length === 0 ||
            friend.username.includes(this.state.input)
          )
            friends.push(this.displayUser(x, this.state.friends[x]));
        }
        x++;
      }
    }
    if (isUsers)
      friends.unshift(
        <input
          key={x++}
          id="searchUserToAdd"
          className="w-100"
          type="text"
          placeholder="Search user here"
          value={this.state.input}
          onChange={(e) => this.setState({ input: e.target.value })}
        />
      );
    if ((isUsers && friends.length === 1) || !isUsers) {
      friends.push(<p key={x}>No available users to add</p>);
    }
    return friends;
  };

  chans = () => {
    let ret: any[] = [];
    //let currentUser: any = sessionStorage.getItem("data");
    //currentUser = JSON.parse(currentUser);
    for (let x = 0; x < this.state.allChans.length; x++) {
      if (
        this.state.allChans[x].type !== "private" &&
        this.state.allChans[x].type !== "direct"
      ) {
        for (let y = 0; y < this.props.chans.length; y++) {
          if (this.state.allChans[x].name === this.props.chans[y].name)
            continue;
          ret.push(
            <div className="row" key={x}>
              <button
                className="col-6"
                onClick={() =>
                  this.props.parentCallBack.joinRoom(
                    this.state.allChans[x],
                    true
                  )
                }
              >
                JOIN
              </button>
              <p className="col-6">{this.state.allChans[x].name}</p>
            </div>
          );
          break;
        }
        if (!this.props.chans.length) {
          ret.push(
            <div className="row" key={x}>
              <button
                className="col-6"
                onClick={() =>
                  this.props.parentCallBack.joinRoom(
                    this.state.allChans[x],
                    true
                  )
                }
              >
                JOIN
              </button>
              <p className="col-6">{this.state.allChans[x].name}</p>
            </div>
          );
        }
      }
    }
    return ret;
  };

  joinPrivateChan = async () => {
    let input = document.getElementById(
      "InputJoinPrivateChan"
    ) as HTMLInputElement;
    let chan = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/chan/" + input.value
    );
    if (!chan) return;
    this.props.parentCallBack.joinRoom(chan, true);
  };

  pressEnter = (e: any) => {
    if (e.key === "Enter") {
      this.joinPrivateChan();
    }
  };

  sendRequest = async () => {
    //let newUser: any = sessionStorage.getItem("data");
    //newUser = JSON.parse(newUser);
    const login = document.getElementById("changeLogin") as HTMLInputElement;
    let ret = await Request(
      "PATCH",
      {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      {
        username: login.value,
        avatar: this.getCurrentUser().avatar,
      },
      "http://localhost:3000/user/settings/" + this.getCurrentUser().auth_id
    );

    if (!ret.ok) {
      window.location.href = "/#" + login.value;
      login.value = "";
      this.hidden();
    }
    let loginError = document.getElementById("loginError") as HTMLDivElement;
    loginError.classList.remove("hidden");
    setTimeout(() => {
      let loginError = document.getElementById("loginError") as HTMLDivElement;
      loginError.classList.add("hidden");
    }, 1700);
  };

  openWin = () => {
    var input = document.createElement("input");
    input.type = "file";
    input.click();
  };

  printer = () => {
    switch (this.props.calledBy) {
      case "Avatar":
        return (
          <div className="p-4 pb-1">
            <header className="p-1 mb-3">
              <h2>{this.props.title}</h2>
            </header>
            <form>
              <input type="text" placeholder="new user name"></input>
            </form>
            <footer>
              <button className="mx-1">Change</button>
              <button className="mx-1" onClick={this.hidden}>
                Cancel
              </button>
            </footer>
          </div>
        );
      case "Login":
        return (
          <div className="p-4 pb-1">
            <header className="mb-3">
              <h2>{this.props.title}</h2>
            </header>
            <form className="mb-3">
              <input
                type="text"
                placeholder="new user name"
                id="changeLogin"
              ></input>
              <p className="hidden" id="loginError">
                This login is not good
              </p>
            </form>
            <footer>
              <button className="mx-1" onClick={this.hidden}>
                Cancel
              </button>
              <button className="mx-1" onClick={this.sendRequest}>
                Change
              </button>
            </footer>
          </div>
        );
      case "newChan":
        return (
          <div className="p-4 pb-1">
            <header className="mb-3">
              <h2>{this.props.title}</h2>
            </header>
            <form className="mb-3">
              <p>
                <input
                  type="radio"
                  name="ChanType"
                  value="public"
                  id="public"
                />
                Public
                <br />
                <input
                  type="radio"
                  name="ChanType"
                  value="private"
                  id="private"
                />
                Private
                <br />
                <input
                  type="radio"
                  name="ChanType"
                  value="protected"
                  id="protected"
                />
                Protected
                <br />
                <input type="text" id="chanName" placeholder="name" onChange={this.handleName}></input>
                <br />
                <div className="messError">{this.state.errName}</div>
                <input type="text" id="chanTopic" placeholder="topic"></input>
                <br />
                <input
                  type="password"
                  id="chanPassword"
                  placeholder="password"
                  onChange={this.handlePass}
                ></input>
                <br />
                <div className="messError">{this.state.errPass}</div>
              </p>
            </form>
            <footer>
              <button className="mx-1" onClick={this.hidden}>
                Cancel
              </button>
              <button className="mx-1" onClick={this.createChan}>
                Create
              </button>
            </footer>
          </div>
        );
      case "addUser":
        return (
          <div className="p-4 pb-1">
            <header className="mb-3">
              <h2>{this.props.title}</h2>
            </header>
            <form className="mb-3">
              <div>{this.users()}</div>
            </form>
            <footer>
              <button className="mx-1" onClick={this.hidden}>
                Close
              </button>
            </footer>
          </div>
        );
      case "joinChan":
        return (
          <div className="p-4 pb-1">
            <header className="mb-3">
              <h2>{this.props.title}</h2>
            </header>
            <div>
              <div>
                <input
                  id="InputJoinPrivateChan"
                  className="col-8"
                  type="text"
                  placeholder="Enter Private Channel"
                  onKeyDown={this.pressEnter}
                ></input>
                <button onClick={this.joinPrivateChan}>JOIN</button>
              </div>
              <div>{this.chans()}</div>
            </div>
            <footer>
              <button className="mx-1" onClick={this.hidden}>
                Close
              </button>
            </footer>
          </div>
        );
    }
  };

  render() {
    return (
      <div className="Modal hidden" id="Modal">
        {this.printer()}
      </div>
    );
  }
}

export default Modal;
