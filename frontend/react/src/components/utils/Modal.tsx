import { Component, ReactNode } from 'react';
import Request from "./Requests"
import { AuthContext } from "../../contexts/AuthProviderContext"
import "../../styles/components/utils/modal.css";
import { Link } from "react-router-dom";
import { ChanType, UserType } from "../../types"
import { Alert } from 'react-bootstrap';

class Modal extends Component<
  {
    title: string,
    calledBy: string,
    userChan?: any[],
    userBan?: any[],
    parentCallBack?: any,
    chans?: any
  },
  {
    user: any,
    friends: any[],
    input: string,
    allChans: Array<ChanType>,
    protected: boolean,
    alertRadio: boolean,
    fieldName: string,
    errName: string,
    alertName: boolean,
    fieldPass: string,
    errPass: string,
    alertPass: boolean,
    printed: any
  }
> {
  static context = AuthContext;
  constructor(props: any) {
    super(props);
    // users: [],
    this.state = {
      user: {},
      friends: [],
      input: "",
      allChans: [],
      protected: false,
      alertRadio: false,
      fieldName: "",
      errName: "",
      alertName: false,
      fieldPass: "",
      errPass: "",
      alertPass: false,
      printed: [],
    };
  }

  hiddenCreate = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    const radioPub = document.querySelector("#public") as HTMLInputElement;
    const radioPri = document.querySelector("#private") as HTMLInputElement;
    const radioPro = document.querySelector("#protected") as HTMLInputElement;
    const chanName = document.querySelector("#chanName") as HTMLInputElement;
    const chanPassword = document.querySelector("#chanPassword") as HTMLInputElement;
    radioPub.checked = false;
    radioPri.checked = false;
    radioPro.checked = false;
    chanName.value = "";
    chanPassword.value = "";
    this.setState({
      protected: false,
      alertRadio: false,
      fieldName: "",
      errName: "",
      alertName: false,
      fieldPass: "",
      errPass: "",
      alertPass: false
    });
    modal.classList.add("hidden");
    chanPassword.classList.add("hidden");
  };

  hiddenJoin = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    this.setState({
      protected: false,
      alertRadio: false,
      fieldName: "",
      errName: "",
      alertName: false,
      fieldPass: "",
      errPass: "",
      alertPass: false
    });
    modal.classList.add("hidden");
  };

  hiddenAddUser = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    this.setState({
      protected: false,
      alertRadio: false,
      fieldName: "",
      errName: "",
      alertName: false,
      fieldPass: "",
      errPass: "",
      alertPass: false
    });
    modal.classList.add("hidden");
  };

  // componentDidUpdate = (
  //     prevProps: Readonly<{
  //         title: string;
  //         calledBy: string;
  //         userChan?: any[];
  //         userBan?: any[];
  //         parentCallBack?: any;
  //         chans?: any }>,
  //     prevState: Readonly<{
  //         user: any;
  //         users: any[];
  //         input: string;
  //         allChans: ChanType[];
  //         printed: any }>,
  //     snapshot?: any) => {
  //     const ctx: any = this.context;
  //     if (prevState.allChans !== ctx.allChans) {
  //         this.setState({allChans: ctx.allChans})
  //     }
  //     if (prevState.user !== ctx.user) {
  //         this.setState({user: ctx.user})
  //     }
  // }

  componentDidMount = async () => {
    const ctx: any = this.context
    let newUser: UserType = ctx.user
    if (newUser) {
      this.setState({ user: newUser });
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

  verifRadio = () => {
    const radioPub = document.querySelector("#public") as HTMLInputElement;
    const radioPri = document.querySelector("#private") as HTMLInputElement;
    const radioPro = document.querySelector("#protected") as HTMLInputElement;
    if (radioPub.checked === false && radioPri.checked === false && radioPro.checked === false) {
      this.setState({ alertRadio: true });
      return false;
    }
    else
      this.setState({ alertRadio: false });
    return true;
  };

  verifName = () => {
    // let users = await getUsers();
    var regex = /^[\w-]+$/
    var minmax = /^.{3,10}$/

    // let retPass = true;
    // if (this.state.protected)
    //   retPass = this.verifPass()
    if (!regex.test(this.state.fieldName)) {
      this.setState({ errName: "Non valid character" });
      this.setState({ alertName: true });
      return false;
    }
    else if (!minmax.test(this.state.fieldName)) {
      this.setState({ errName: "Name must contains between 3 and 10 characters" });
      this.setState({ alertName: true });
      return false;
    }
    else if (this.state.allChans.findIndex((c: any) => c.name === this.state.fieldName) > -1) {
      this.setState({ errName: "This username already exists" });
      this.setState({ alertName: true });
      return false;
    }
    else {
      this.setState({ errName: "" });
      this.setState({ alertName: false });
    }
    // if (!retPass)
    //   return false;
    return true;
  };

  verifPass = () => {
    var minmax = /^.{8,30}$/

    if (!minmax.test(this.state.fieldPass)) {
      this.setState({ errPass: "Password must contains between 8 and 30 characters" });
      this.setState({ alertPass: true });
      return false;
    }
    // else {
    //   this.setState({ errPass: "" });
    //   this.setState({ alertPass: false });
      return true;
    // }
  };

  createChan = async () => {
    let retRadio = this.verifRadio();
    let retName = this.verifName();
    let retPass = true;
    if (this.state.protected)
      retPass = this.verifPass();
    if (retRadio && retName && retPass) {
      this.props.parentCallBack.createChannel()
      this.hiddenCreate()
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
          <Link to={"/profil/" + user.username} className="mx-2">
            {user.username}
          </Link>
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

  checkIfOwner(chan: ChanType) {
    for (let index = 0; index < this.props.chans.length; index++) {
      if (chan.id === this.props.chans[index].id) {
        return true;
      }
    }
    return false;
  }

  checkIfBanned(chan: ChanType) {
    const ctx: any = this.context;
    const banned = ctx.bannedFrom;
    for (let index = 0; index < banned.length; index++) {
      if (chan.id === banned[index].id) {
        return true;
      }
    }
    return false;
  }

  checkIfAlreadyIn(chan: ChanType) {
    const ctx: any = this.context;
    const joined = ctx.chanFrom;
    for (let index = 0; index < joined.length; index++) {
      if (chan.id === joined[index].id) {
        return true;
      }
    }
    return false;
  }

  chans = () => {
    let ret: any[] = [];
    for (let x = 0; x < this.state.allChans.length; x++) {
      if (
        this.state.allChans[x].type !== "private" &&
        this.state.allChans[x].type !== "direct"
      ) {
        if (!this.checkIfOwner(this.state.allChans[x]) &&
          !this.checkIfBanned(this.state.allChans[x]) &&
          !this.checkIfAlreadyIn(this.state.allChans[x])) {
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
    this.setState({ printed: ret })
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

  closeAlertRadio = () => {
    this.setState({ alertRadio: false });
  }

  handleName = (evt: any) => {
    evt.preventDefault();
    this.setState({ fieldName: evt.target.value });
  };

  closeAlertName = () => {
    this.setState({ alertName: false });
    this.setState({ errName: "" })
  }

  handlePass = (evt: any) => {
    evt.preventDefault();
    this.setState({ fieldPass: evt.target.value });
  };

  closeAlertPass = () => {
    this.setState({ alertPass: false });
    this.setState({ errPass: "" })
  }

  printer = () => {
    switch (this.props.calledBy) {
      case "newChan":
        return (
          <div className="p-4 pb-1">
            <header className="mb-3">
              <h2>{this.props.title}</h2>
            </header>
            <form className="mb-3 d-flex align-items-start flex-column">
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  name="ChanType"
                  value="public"
                  id="public"
                  onChange={this.hiddenPass}
                  className='mx-2'
                />
                Public
              </div>
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  name="ChanType"
                  value="private"
                  id="private"
                  onChange={this.hiddenPass}
                  className='mx-2'
                />
                Private
              </div>
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  name="ChanType"
                  value="protected"
                  id="protected"
                  onChange={this.showPass}
                  className='mx-2'
                />
                Protected
              </div>
              <div>
                {this.state.alertRadio ?
                  <Alert onClose={this.closeAlertRadio} variant="danger" dismissible>{"Choose a chan type"}</Alert> :
                  // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                  <div />
                }
              </div>
              <input
                type="text"
                id="chanName"
                placeholder="name"
                onChange={this.handleName}
                className='mt-2'
              />
              <div>
                {this.state.alertName ?
                  <Alert onClose={this.closeAlertName} variant="danger" dismissible>{this.state.errName}</Alert> :
                  // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                  <div />
                }
              </div>
              {/* <br /> */}
              <input
                type="text"
                id="chanPassword"
                placeholder="password"
                className='hidden'
              ></input>
              <div>
                {this.state.alertPass ?
                  <Alert onClose={this.closeAlertPass} variant="danger" dismissible>{this.state.errPass}</Alert> :
                  // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                  <div />
                }
              </div>
              {/* <br /> */}
            </form>
            <footer>
              <button className="mx-1" onClick={this.hiddenCreate}>
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
              <button className="mx-1" onClick={this.hiddenAddUser}>
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
              {/* <div>{this.chans()}</div> */}
              <div>{this.state.printed}</div>
            </div>
            <footer>
              <button className="mx-1" onClick={this.hiddenJoin}>
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
