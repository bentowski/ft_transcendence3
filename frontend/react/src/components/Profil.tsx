import { Component } from "react";
import Modal from "./utils/Modal";
import Request from "./utils/Requests";

class History extends Component<{ value: number }, {}> {
  renderHistory(login: string, x: number) {
    return (
      <div key={x} className="friendsDiv row">
        <div className="col-1">
          <p>score 1</p>
        </div>
        <div className="col-1">
          <p>-</p>
        </div>
        <div className="col-1">
          <p>score 2</p>
        </div>
        <div className="col-6">
          <p>win/loose</p>
        </div>
        <p className="col-2">{login}</p>
        <img src="avatar" className="col-1 rounded-circle" alt="" />
      </div>
    );
  }
  render() {
    let x = 0; //variable a changer selon le back
    const items: any = [];
    while (x < this.props.value) {
      items.push(this.renderHistory("friends 1", x));
      x++;
    }
    return <div>{items}</div>;
  }
}

class Profil extends Component<
  {},
  { avatar: any; modalType: string; modalTitle: string; login: string }
> {
  state = {
    avatar: "https://avatars.dicebear.com/api/personas/" + 36 + ".svg",
    modalType: "",
    modalTitle: "",
    login: "",
    //undefined: true,
  };

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

  /*
  checkIfJSONisNotEmpty = (obj: any) => {
    return Object.keys(obj).length > 0;
  };
  */

  getUser = async (username: string) => {
    console.log("hellu");
    let user = await Request(
      "GET",
      {},
      {},
      "http://localhost:3000/user/name/" + username
    );
    //console.log("prout = " + user);
    if (user) {
      console.log("get user ok ");
      //this.setState({ undefined: false });
      this.setState({ login: user.username });
    }
  };

  // componentDidMount = () => {
  // 		let url = document.URL
  // 		let x = 0;
  // 		while (url[x] != '#' && url[x])
  // 		{
  // 			x++;
  // 		}
  // 		x++;
  // 		let tmp = ""
  // 		while (url[x])
  // 		{
  // 			tmp += url[x++]
  // 		}
  // 		console.log(tmp)
  // 		this.getUser(tmp);
  // }

  componentDidMount = () => {
    let newUser: any = sessionStorage.getItem("data");
    console.log("new user = " + newUser);
    if (!newUser) return;
    newUser = JSON.parse(newUser);
    this.setState({ avatar: newUser.avatar });
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
    console.log("tmp = " + tmp);
    if (tmp !== "") this.getUser(tmp);
  };

  render() {
    window.addEventListener("popstate", (event) => {
      let url = document.URL;
      let x = 0;
      while (url[x] != "#" && url[x]) {
        x++;
      }
      x++;
      let tmp = "";
      while (url[x]) {
        tmp += url[x++];
      }
      console.log(tmp);
      if (tmp !== "") this.getUser(tmp);
    });
    // <button className="col-1">
    // <button className="modifName col-2">
    // </button>
    // </button>
    return (
      <div className="Profil">
        <div className="ProfilHeader">
          <div className="ProfilInfoPers">
            <Modal
              title={this.state.modalTitle}
              calledBy={this.state.modalType}
            />
            <img
              onClick={this.promptAvatar}
              className="modifAvatar mb-2"
              src={this.state.avatar}
              alt=""
            />
            <h3 onClick={this.promptLogin}>{this.state.login}</h3>
          </div>{" "}
          {/* fin ProfilInfPer */}
          <div className=" mt-5 pt-5">
            <History value={7} />
          </div>
        </div>{" "}
        {/* fin ProfilHeader*/}
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default Profil;
