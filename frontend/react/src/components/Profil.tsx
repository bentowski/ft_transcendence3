import { Component } from 'react';
import Modal from "./utils/Modal";
import Request from "./utils/Requests"

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
		)
	}
	render() {
		let x = 0; //variable a changer selon le back
		const items: any = []
		while (x < this.props.value) {
			items.push(this.renderHistory("friends 1", x))
			x++;
		}
		return (
			<div>
				{items}
			</div>
		);
	}
}

class Profil extends Component< {}, {modalType: string, modalTitle: string}> {
	state = {
		modalType: "",
		modalTitle: ""
	}

	promptAvatar = () => {
		let modal = document.getElementById("Modal") as HTMLDivElement;
		modal.classList.remove('hidden');
		this.setState({modalType: "Avatar", modalTitle: "Change avatar"})
	}

	promptLogin = () => {
		let modal = document.getElementById("Modal") as HTMLDivElement;
		modal.classList.remove('hidden');
		this.setState({modalType: "Login", modalTitle: "Change user name"})
	}

	render() {
		return (
			<div className="Profil">
				<div className="ProfilHeader">
					<div className="ProfilInfoPers">
						<Modal title={this.state.modalTitle} calledBy={this.state.modalType}/>
						<a href="#changeAvatar">
							<img onClick={this.promptAvatar} className="modifAvatar mb-2" src="/pictures/ivloisy.jpg" alt="" />
						</a>
						<a className="modifName" href="#changeLogin">
							<h3 onClick={this.promptLogin}>login</h3>
						</a>
					</div> {/* fin ProfilInfPer */}
					<div className=" mt-5 pt-5">
						<History value={7} />
					</div>
				</div> {/* fin ProfilHeader*/}
			</div>
		); // fin de return
	} // fin de render
} // fin de App

export default Profil;
