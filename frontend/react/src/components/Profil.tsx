import { Component } from "react";
import Modal from "./utils/Modal";
import Request from "./utils/Requests"
import HistoryCards from "./utils/HistoryCards";


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


class Profil extends Component<{}, { avatar: any, modalType: string, modalTitle: string, login: string, histories: Array<any> }> {
	constructor(props: any) {
		super(props);
		this.state = {
			avatar: "https://avatars.dicebear.com/api/personas/" + 36 + ".svg",
			modalType: "",
			modalTitle: "",
			login: "",
			histories: []
		};
	}

	promptAvatar = () => {
		let modal = document.getElementById("Modal") as HTMLDivElement;
		modal.classList.remove('hidden');
		this.setState({ modalType: "Avatar", modalTitle: "Change avatar" })
	}

	promptLogin = () => {
		let modal = document.getElementById("Modal") as HTMLDivElement;
		modal.classList.remove('hidden');
		this.setState({ modalType: "Login", modalTitle: "Change user name" })
	}

  /*
  checkIfJSONisNotEmpty = (obj: any) => {
    return Object.keys(obj).length > 0;
  };
  */

	getUser = async (username: string) => {
			let user = await Request('GET', {}, {}, "http://localhost:3000/user/name/" + username)
			this.setState({ login: user.username })
		}

	getHistory = async () => {
		let histories = await Request('GET', {}, {}, "http://localhost:3000/parties/histories/all")
		this.setState({ histories: histories })
	}

	componentDidMount = () => {
		let newUser: any = sessionStorage.getItem('data');
		newUser = JSON.parse(newUser);
		this.setState({ avatar: newUser.user.avatar });
		let url = document.URL
		let x = 0;
		while (url[x] !== '#' && url[x]) {
			x++;
		}
		x++;
		let tmp = ""
		while (url[x]) {
			tmp += url[x++]
		}
		console.log(tmp)
		this.getUser(tmp);
		this.getHistory();
	}

	render() {
		window.addEventListener('popstate', (event) => {
			let url = document.URL
			let x = 0;
			while (url[x] !== '#' && url[x]) {
				x++;
			}
			x++;
			let tmp = ""
			while (url[x]) {
				tmp += url[x++]
			}
			console.log(tmp)
			this.getUser(tmp);
		})
		// <button className="col-1">
		// <button className="modifName col-2">
		// </button>
		// </button>
		let histories: Array<any> = [];
		let i = this.state.histories.length - 1;
		while (i >= 0) {
			if (this.state.histories[i].user_one === this.state.login || this.state.histories[i].user_two === this.state.login)
				histories.push(<HistoryCards history={this.state.histories[i]} profil={this.state.login} />)
			i--;
		}
		return (
			<div className="Profil">
				<div className="ProfilHeader">
					<div className="ProfilInfoPers">
						<Modal title={this.state.modalTitle} calledBy={this.state.modalType} />
						<img onClick={this.promptAvatar} className="modifAvatar mb-2" src={this.state.avatar} alt="" />
						<h3 onClick={this.promptLogin}>{this.state.login}</h3>
					</div> {/* fin ProfilInfPer */}
					<div className=" mt-5 pt-5">
						{histories}
					</div>
				</div> {/* fin ProfilHeader*/}
			</div>
		); // fin de return
	} // fin de render
} // fin de App

export default Profil;
