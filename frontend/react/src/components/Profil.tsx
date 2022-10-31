import React, { Component } from 'react';
import Request from "./utils/Requests";
import HistoryCards from "./utils/HistoryCards";

class Profil extends Component<{}, { user: any; histories: Array<any> }> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {},
      histories: [],
    };
  }

  getUser = async (username: string) => {
    if (!username) {
      let currentUser: any = sessionStorage.getItem("data");
      currentUser = JSON.parse(currentUser);
      username = currentUser.user.username;
    }
    let newUser = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/user/name/" + username
    );
    if (!newUser)
      return;
    this.setState({ user: newUser });
    console.log("user = ", this.state.user);
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

  componentDidMount = () => {
    let url = document.URL;
    let x = 0;
    while (url[x] !== "#" && url[x]) {
      x++;
    }
    x++;
    let tmp = "";
    while (url[x]) {
      tmp += url[x++];
    }
    // console.log("tmp = ", tmp);
    // if (tmp === "") {
    //   console.log("caca");
    //   this.setState({ user: currentUser.user });
    //   console.log("user = ", this.state.user);
    // }
    // else
    this.getUser(tmp);
    this.getHistory();
  }

  printHeader = () => {
    let currentUser: any = sessionStorage.getItem("data");
    currentUser = JSON.parse(currentUser);
    // console.log("current user = ", currentUser.user);
    if (this.state.user.auth_id === currentUser.user.auth_id) {
      return (
        <div className='ProfilHeader'>
          <h1>Coucou</h1>
        </div>
      )
    }
    else {
      // console.log("username")
      return (
        <div className='ProfilHeader'>
          {/* <h2>Caca</h2> */}
          <img
            className="Avatar mb-2"
            src={this.state.user.avatar}
            alt=""
          />
          <h3>{this.state.user.username}</h3>
        </div>
      )
    }
  }

  render() {
    window.addEventListener("popstate", (event) => {
      let url = document.URL;
      let x = 0;
      while (url[x] !== "#" && url[x]) {
        x++;
      }
      x++;
      let tmp = "";
      // console.log("tmp = ", tmp, ";")
      while (url[x]) {
        tmp += url[x++];
      }
      // console.log("tmp = ", tmp, ";")
      if (document.URL.includes("/profil"))
        this.getUser(tmp);
    });
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
        {/* {this.state.user.username} */}
        {this.printHeader()}
        <div className="Stats mt-5">
          <h3>Stats</h3>
          Games won : {this.state.user.game_won}/{this.state.user.total_games}<br />
          Games lost : {this.state.user.game_lost}/{this.state.user.total_games}
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
