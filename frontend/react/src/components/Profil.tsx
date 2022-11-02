import React, { Component } from 'react';
import Request from "./utils/Requests";
import HistoryCards from "./utils/HistoryCards";
// import Modal from "./utils/Modal";
import '../styles/components/profil.css'

class Profil extends Component<{}, { user: any; histories: Array<any> }> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {},
      histories: [],
      // modalType: "",
      // modalTitle: "",
    };
  }

  // promptAvatar = () => {
  //   let modal = document.getElementById("Modal") as HTMLDivElement;
  //   modal.classList.remove("hidden");
  //   this.setState({ modalType: "Avatar", modalTitle: "Change avatar" });
  // };

  // promptLogin = () => {
  //   let modal = document.getElementById("Modal") as HTMLDivElement;
  //   modal.classList.remove("hidden");
  //   this.setState({ modalType: "Login", modalTitle: "Change user name" });
  // };

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
    // console.log("user = ", this.state.user);
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
        <div className='ProfilHeader align-items-center'>
          {/* <Modal
            title={this.state.modalTitle}
            calledBy={this.state.modalType}
          /> */}
          <div className="Avatar d-flex flex-row justify-content-start">
            <img
              // onClick={this.promptAvatar}
              className="modifAvatar mb-2"
              src={this.state.user.avatar}
              alt=""
              data-bs-toggle="modal" data-bs-target="#changeAvatar"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill mx-2" viewBox="0 0 16 16">
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
            </svg>
          </div>
          <a href="#" className='d-flex flex-row justify-content-start align-items-center' data-bs-toggle="modal" data-bs-target="#changeName">
            <h3>{this.state.user.username}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill mx-2" viewBox="0 0 16 16">
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
            </svg>
          </a>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />2fa
            {/* <label className="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label> */}
          </div>
        </div>
      )
    }
    else {
      return (
        <div className='ProfilHeader'>
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
        <div className="modal fade" id="changeAvatar" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Change avatar</h1>
                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <input type="text" placeholder="new avatar"></input>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="">Change</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="changeName" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Change user name</h1>
                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <input type="text" placeholder="new user name"></input>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="">Change</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profil;
