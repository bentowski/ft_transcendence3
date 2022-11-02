import { Component } from "react";
import Modal from "./utils/Modal";
import Request from "./utils/Requests";
import HistoryCards from "./utils/HistoryCards";
import GetAvatar from "./utils/GetAvatar";

class Profil extends Component< {},
  {
    avatar: any;
    modalType: string;
    modalTitle: string;
    login: string;
    histories: Array<any>;
    location: string
  }> {
  constructor(props: any) {
    super(props);
    this.state = {
      avatar: "https://avatars.dicebear.com/api/personas/" + 36 + ".svg",
      modalType: "",
      modalTitle: "",
      login: "",
      histories: [],
      location: ""
    };
  }

  promptAvatar = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove("hidden");
    this.setState({ modalType: "Avatar", modalTitle: "Change avatar" });
  };

  promptLogin = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove("hidden");
    this.setState({ modalType: "Login", modalTitle: "Change user name" });
  };

  getUser = async (username: string) => {
    if (!username) {
      let newUser: any = sessionStorage.getItem("data");
      newUser = JSON.parse(newUser);
      username = newUser.user.username;
    }
    let user = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/user/name/" + username
    );
    if (!user) return;
      this.setState({ login: user.username, avatar: user.avatar });
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
    // window.addEventListener("hashchange", (event) => {
    //   console.log("AAAAAAAAAAAA")
    //   let url = document.URL;
    //   url = url.substring(url.lastIndexOf("#") + 1)
    //   if (document.URL.includes("localhost:8080/profil"))
    //   	this.getUser(url);
    // });
    let newUser: any = sessionStorage.getItem("data");
    newUser = JSON.parse(newUser);
    // let url = document.URL;
    // url = url.substring(url.lastIndexOf("#") + 1)
    // console.log(url)
    // this.getUser(url);
    // this.getHistory();
    // if (!document.URL.includes("localhost:8080/profil"))
    //   return;
    setInterval(() => {

      let url = document.URL
      url = url.substring(url.lastIndexOf("/") + 1)
      if (url !== this.state.location)
      {
        this.getUser(url);
        this.getHistory();
        this.setState({location: url})
      }
    }, 10)

  };

  render() {
    // window.addEventListener("hashchange", (event) => {
    //   console.log("AAAAAAAAAAAA")
    //   let url = document.URL;
    //   url = url.substring(url.lastIndexOf("#") + 1)
    //   	this.getUser(url);
    // });
    let histories: Array<any> = [];
    let i = this.state.histories.length - 1;
    while (i >= 0) {
      if (
        this.state.histories[i].user_one === this.state.login ||
        this.state.histories[i].user_two === this.state.login
      )
        histories.push(
          <HistoryCards
            history={this.state.histories[i]}
            profil={this.state.login}
          />
        );
      i--;
    }
    return (
      <div className="Profil">
        <div className="ProfilHeader">
          <div className="ProfilInfoPers">
            <Modal
              title={this.state.modalTitle}
              calledBy={this.state.modalType}
            />
            <GetAvatar className="modifAvatar mb-2" width="" height="" alt="" />

            <h3 onClick={this.promptLogin}>{this.state.login}</h3>
          </div>
          {/* fin ProfilHeader*/}
          </div>
        </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default Profil;

/*
<img
    onClick={this.promptAvatar}
    className="modifAvatar mb-2"
    src={this.state.avatar}
    alt=""
/>
*/
