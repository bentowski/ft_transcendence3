import { Component } from 'react';
import Request from "./Requests"
import { AuthContext } from "../../contexts/AuthProviderContext"
import "../../styles/components/utils/modal.css";
import { ChanType, UserType } from "../../types"
import { Alert } from 'react-bootstrap';

class Modal extends Component<
  {
    title: string;
    calledBy: string;
    userChan?: any[];
    userBan?: any[];
    parentCallBack?: any;
    chans?: any;
  },
  {
    user: any;
    friends: any[];
    input: string;
    allChans: Array<ChanType>;
    protected: boolean;
    fieldName: string;
    errName: string;
    alertName: boolean;
  }
> {
  static context = AuthContext;
  constructor(props: any) {
    super(props);
    this.state = {
      user: {
        auth_id: 0,
        user_id: 0,
        avatar: "",
        username: "",
      },
      friends: [],
      input: "",
      allChans: [],
      protected: false,
      fieldName: "",
      errName: "",
      alertName: false,
    };
  }

  hidden = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.add("hidden");
    this.setState({fieldName: ""});
    this.setState({errName: ""});
    this.setState({alertName: false});
    this.setState({ protected: false })
  };

  getCurrentUser = () => {
    const ctx: any = this.context;
    return ctx.user;
  };

  componentDidMount = async () => {
    let newUser: any = sessionStorage.getItem("data");
    if (newUser) {
      newUser = JSON.parse(newUser);
      this.setState({ user: newUser.user });
    }
    try {
      let friends: any = await Request(
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
    } catch (error) {
      const ctx: any = this.context;
      ctx.setError(error);
    }
  };

  verifName = () => {
    // let users = await getUsers();
    var regex = /^[\w-]+$/
    var minmax = /^.{3,10}$/

    if (!regex.test(this.state.fieldName)) {
      this.setState({errName: "Non valid character"});
      this.setState({alertName: true});
      return false;
    }
    else if (!minmax.test(this.state.fieldName)) {
      this.setState({errName: "Name must contains between 3 and 10 characters"});
      this.setState({alertName: true});
      return false;
    }
    // else if (this.state.allChans.findIndex((c: any) => c.name === this.state.fieldName) > -1) {
    //   this.setState({errName: "This username already exists"});
    //   this.setState({alertName: true});
    //   return false;
    // }
    return true;
  };

  createChan = async () => {
    if (this.verifName()) {
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

  /*
  componentDidUpdate(prevProps: Readonly<{
      title: string;
      calledBy: string;
      userChan?: any[];
      userBan?: any[];
      parentCallBack?: any;
      chans?: any }>,
                     prevState: Readonly<{
      user: any;
      friends: any[];
      input: string;
      allChans: Array<ChanType> }>, snapshot?: any
  ) {

  }
   */

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
            console.log('hello ', this.state.friends[x]);
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

  showPass = () => {
    let intput = document.getElementById("chanPassword") as HTMLDivElement;
    intput.classList.remove("hidden");
    this.setState({ protected: true });
    // login.value = "";
  };

  hiddenPass = () => {
    let intput = document.getElementById("chanPassword") as HTMLDivElement;
    intput.classList.add("hidden");
    this.setState({ protected: false });
    // login.value = "";
  };

  handleName = (evt: any) => {
    evt.preventDefault();
    this.setState({ fieldName: evt.target.value });
  };

  closeAlertName = () => {
    // console.log('closing alert');
    this.setState({alertName: false});
    this.setState({errName: ""})
    // setErr("");
    // setAlertMsg("");
  }

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
                  onChange={this.hiddenPass}
                />
                Public
                <br />
                <input
                  type="radio"
                  name="ChanType"
                  value="private"
                  id="private"
                  onChange={this.hiddenPass}
                />
                Private
                <br />
                <input
                  type="radio"
                  name="ChanType"
                  value="protected"
                  id="protected"
                  onChange={this.showPass}
                />
                Protected
                <br />
                <input
                  type="text"
                  id="chanName"
                  placeholder="name"
                  onChange={this.handleName}
                />
                <div>
                  {this.state.alertName ?
                    <Alert onClose={this.closeAlertName} variant="danger" dismissible>{this.state.errName}</Alert> :
                    // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                    <div />
                  }
                </div>
                <br />
                <input
                  type="text"
                  id="chanPassword"
                  placeholder="password"
                  className='hidden'
                ></input>
                <br />
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
            <div>{this.users()}</div>
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
        )
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


/*
  displayUser = (id:number, user:any) => {
    return (
      <div key={id} className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center">
        <div className="col-5 h-100 overflow-hidden buttons">
          <button onClick={()=>this.props.parentCallBack.socket.emit("addToChannel", {"room": this.props.parentCallBack.room,"auth_id": user.auth_id})}>ADD</button>
        </div>
        <div className="col-2 d-flex flex-row d-flex justify-content-center">
          <input className={user.isOnline ? "online" : "offline"} type="radio"></input>
        </div>
        <div className="col-5 d-flex flex-row justify-content-end align-items-center">
          <a href={"/profil/#" + user.username} className="mx-2">{user.username}</a>
          <img src={user.avatar} className="miniAvatar" width={150} height={150}/>
        </div>
      </div>
    )
  }
  //
  // usersChanBan = () => {
  //   let test: any = this.props.userChan
  //   let ret: any[] = []
  //   const context: any = this.context
  //   const user: any = context.user
  //
  //   // for(let x = 0; x < test.length; x++)
  //   // {
  //   //   if (this.state.friends[x].username !== user.username)
  //   //     ret.push(
  //   //       <div key={id} className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center">
  //   //         <div className="col-5 h-100 overflow-hidden buttons">
  //   //           <button onClick={()=>this.props.parentCallBack.socket.emit("addToChannel", {"room": this.props.parentCallBack.room,"auth_id": user.auth_id})}>ADD</button>
  //   //         </div>
  //   //         <div className="col-2 d-flex flex-row d-flex justify-content-center">
  //   //           <input className={user.isOnline ? "online" : "offline"} type="radio"></input>
  //   //         </div>
  //   //         <div className="col-5 d-flex flex-row justify-content-end align-items-center">
  //   //           <a href={"/profil/#" + user.username} className="mx-2">{user.username}</a>
  //   //           <img src={user.avatar} className="miniAvatar" width={150} height={150}/>
  //   //         </div>
  //   //       </div>
  //   //     );
  //   // }
  //   return ret
  // }
  users = () => {
    let friends: Array<any> = [];
    let isUsers: boolean = false;
    let x: number = 0;
    if (this.state.friends.length > 0) {
      let chanUser: any[] | undefined = this.props.userChan;
      while (
        chanUser?.length &&
        chanUser?.length > 0 &&
        x < this.state.friends.length
      ) {
        let friend: any = this.state.friends[x];
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
  }
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
  createChan = () => {
    this.props.parentCallBack.createChannel()
    this.hidden()
  }
  printer = () => {
    switch (this.props.calledBy) {
      case "Avatar":
        return (
          <div>
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
          <div>
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
          <div>
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
                <input type="text" id="chanName" placeholder="name"></input>
                <br />
                <input type="text" id="chanTopic" placeholder="topic"></input>
                <br />
                <input
                  type="text"
                  id="chanPassword"
                  placeholder="password"
                ></input>
                <br />
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
          <div>
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
        <div>
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
      case "banUser":
      return (
        <div>
            <div>
              {this.usersChan()}
            </div>
          <footer>
            <button className="mx-1" onClick={this.hidden}>
              Close
            </button>
          </footer>
        </div>
      );
      case "muteUser":
      return (
        <div>
          <form className="mb-3">
            <div>
              {this.usersChan()}
            </div>
          </form>
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
      <div className="p-4 pb-1">
        <header className="mb-3">
          <h2>{this.props.title}</h2>
        </header>
        {this.printer()}
        </div>
      </div>
    );
  }
}
export default Modal;
*/