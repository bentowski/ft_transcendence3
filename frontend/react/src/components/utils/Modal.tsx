import { Component } from 'react';
import "../../styles/components/utils/modal.css";
import Request from "./Requests"
import io from 'socket.io-client';
import FriendsNav from '../FriendsNav';
import { useResolvedPath } from 'react-router-dom';
import UserCards from './UserCards';

const socket = io('http://localhost:3000/chat');

class Modal extends Component<{ title: string, calledBy: string, userChan?: any[], parentCallBack?: any}, {}> {
  state = {
    user: {
      auth_id: 0,
      user_id: 0,
      avatar: "",
      username: "",
    },
	friends: [],
  };


  hidden = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.add("hidden");
    const login = document.getElementById("changeLogin") as HTMLInputElement;
    // login.value = "";
  };

  componentDidMount = async () => {
    let newUser: any = sessionStorage.getItem("data");
    // console.log(newUser);
    if (newUser) {
    	newUser = JSON.parse(newUser);
    	this.setState({ user: newUser.user });
	}
	let friends:any = await Request('GET', {}, {}, "http://localhost:3000/user/")
	  if (!friends)
		return ;
	  this.setState({ friends: friends })
  };

  createChan = async () => {
    const name = document.querySelector("#chanName") as HTMLInputElement;
    const topic = document.querySelector("#chanTopic") as HTMLInputElement;
    const password = document.querySelector("#chanPassword") as HTMLInputElement;
    const radioPub = document.querySelector("#public") as HTMLInputElement;
    const radioPri = document.querySelector("#private") as HTMLInputElement;
    const radioPro = document.querySelector("#protected") as HTMLInputElement;
    let radioCheck = "";
    let pswd = "";
    if (radioPub.checked === true)
      radioCheck = "public";
    else if (radioPri.checked === true)
      radioCheck = "private";
    else if (radioPro.checked === true)
      radioCheck = "protected";
	let chans = await Request('GET', {}, {}, "http://localhost:3000/chan/")
	chans = chans.find((c:any) => c.name === name.value)
    if (radioCheck !== "" && name.value && topic.value && chans === undefined) {
      if (password.value)
        pswd = password.value;
      await Request(
        "POST",
        {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        {
          name: name.value,
          type: radioCheck,
          topic: topic.value,
          admin: [this.state.user.username],
          password: pswd,
        },
        "http://localhost:3000/chan/create"
      );
	  let chan = await Request('GET', {}, {}, ("http://localhost:3000/chan/" + name.value))
      name.value = "";
      topic.value = "";
      password.value = "";
      radioPub.checked = false;
      radioPri.checked = false;
      radioPro.checked = false;
      this.hidden();
      socket.emit('chanCreated');
	  window.location.replace('http://localhost:8080/tchat#' + chan.id)
	  window.location.reload();
    }
    else {
      alert("You have to fill each informations");
    }
  };

  displayUser = (id:number, user:any) => {
	return (
		<div key={id} className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center">
			<div className="col-5 h-100 overflow-hidden buttons">
				<button onClick={()=>this.props.parentCallBack.socket.emit("addToChannel", {"room": this.props.parentCallBack.room,"auth_id": user.auth_id})}>TEST!</button>
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

  users = () => {
	let friends: Array<any> = [];
    if (this.state.friends.length > 0)
    {
	  let chanUser:any[]|undefined = this.props.userChan;
	  let x:number = 0;
      while (chanUser?.length && chanUser?.length > 0 && x < this.state.friends.length) {
		let friend:any = this.state.friends[x];
		if (!chanUser.find(user => user.auth_id === friend.auth_id))
        	friends.push(this.displayUser(x, this.state.friends[x]));
        x++;
      }
  	}
	if (friends.length === 0) {
		friends.push(<p>No available users to add</p>)
	}
	return friends
  }

  sendRequest = async () => {
    let newUser: any = sessionStorage.getItem("data");
    newUser = JSON.parse(newUser);
    const login = document.getElementById("changeLogin") as HTMLInputElement;
    let ret = await Request(
      "PATCH",
      {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      {
        username: login.value,
        avatar: newUser.user.avatar,
      },
      "http://localhost:3000/user/settings/" + newUser.user.auth_id
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
                  name="chanType"
                  value="public"
                  id="public"
                />
                Public
                <br />
                <input
                  type="radio"
                  name="chanType"
                  value="private"
                  id="private"
                />
                Private
                <br />
                <input
                  type="radio"
                  name="chanType"
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
          <div className="p-4 pb-1">
            <header className="mb-3">
              <h2>{this.props.title}</h2>
            </header>
            <form className="mb-3">
              <p>
				{this.users()}
			  </p>
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
        {this.printer()}
      </div>
    );
  }
}

export default Modal;
