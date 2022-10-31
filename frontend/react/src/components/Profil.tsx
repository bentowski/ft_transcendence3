import { Component } from "react";
import Modal from "./utils/Modal";
import Request from "./utils/Requests";
import HistoryCards from "./utils/HistoryCards";
import UseAvatar from "../hooks/useAvatar";
import {AuthContext} from "../contexts/AuthProviderContext";

// class History extends Component<{ value: number }, {}> {
// 	renderHistory(login: string, x: number) {
// 		return (
// 			<div key={x} className="friendsDiv row">
// 				<div className="col-1">
// 					<p>score 1</p>
// 				</div>
// 				<div className="col-1">
// 					<p>-</p>
// 				</div>
// 				<div className="col-1">
// 					<p>score 2</p>
// 				</div>
// 				<div className="col-6">
// 					<p>win/loose</p>
// 				</div>
// 				<p className="col-2">{login}</p>
// 				<img src="avatar" className="col-1 rounded-circle" alt="" />
// 			</div>
// 		)
// 	}
// 	render() {
// 		let x = 0; //variable a changer selon le back
// 		const items: any = []
// 		while (x < this.props.value) {
// 			items.push(this.renderHistory("friends 1", x))
// 			x++;
// 		}
// 		return (
// 			<div>
// 				{items}
// 			</div>
// 		);
// 	}
// }

class Profil extends Component<
  {},
  {
    modalType: string;
    modalTitle: string;
    histories: Array<any>;
  }
> {
  static contextType = AuthContext

  constructor(props: any) {
    super(props);
    this.state = {
      modalType: "",
      modalTitle: "",
      histories: [],
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

	/*
	checkIfJSONisNotEmpty = (obj: any) => {
		return Object.keys(obj).length > 0;
	};
	*/

  getUser = () => {
    const data: any = this.context;
    return data.user;
  }

  getUsername = () => {
    const newUser: any = this.getUser();
     return newUser.username;
  };

  getAvatar = () => {
    const newUser: any = this.getUser();
    return newUser.avatar;
  };

  getHistory = () => {
    const newUser: any = this.getUser();
    return newUser.histories;
  }

  /*
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

   */

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
    //console.log(tmp);
    //this.getUser(tmp);
    //this.getHistory();
  };

  render() {
    window.addEventListener("popstate", (event) => {
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
	  //if (document.URL.includes("localhost:8080/profil"))
      	//this.getUser(tmp);
    });
    //console.log(this.state.login)
    let histories: Array<any> = [];
    let i = this.state.histories.length - 1;
    while (i >= 0) {
      if (
        this.state.histories[i].user_one === this.getUsername() ||
        this.state.histories[i].user_two === this.getUsername()
      )
        histories.push(
          <HistoryCards
            history={this.getHistory()}
            profil={this.getUsername()}
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
            <UseAvatar className="modifAvatar mb-2" width="" height="" alt="" />

            <h3 onClick={this.promptLogin}>{this.getUsername()}</h3>
          </div>{" "}
          {/* fin ProfilInfPer */}
          <div className=" mt-5 pt-5">{histories}</div>
        </div>{" "}
        {/* fin ProfilHeader*/}
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