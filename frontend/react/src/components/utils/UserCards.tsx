import { Component } from 'react';
// import { Link } from "react-router-dom";
import Request from "./Requests"
import '../../styles/components/UserCards.css'
// import Login from '../../pages/Login';

class UserCards extends Component<{ user: any, avatar: boolean }, { login: string, id: number, online: string }> {
	constructor(props: any) {
		super(props);
		this.state = { login: "test", id: props.user.auth_id, online: this.props.user.online ? "online" : "offline" };
	}


	renderUserCards = (id: number) => {

		// let online = this.props.online ? "true" : "false"
		if (this.props.avatar) {
			return (
				<div key={id} className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center m-2">
					<div className="col-3 h-100 overflow-hidden buttons">
						<button className="w-100 h-50">Tchat</button>
						<button className="w-100 h-50">Play</button>
					</div>
					<div className="">
						<input className={this.state.online} type="radio"></input>
					</div>
					<div className="d-flex flex-row align-items-center">
						<a href={"/profil/#" + this.state.login} className="mx-2">{this.state.login}</a>
						<img src="avatar" className="miniAvatar h-100 w-100" alt="" />
					</div>
				</div>
			)
		}

		return (
			<div key={id} className="friendsDiv row my-2">
				<div className="col-3 button">
					<button className="buttons">Chat</button>
					<button className="buttons">Play</button>
				</div>
				<div className="col-3">
					<input className={this.state.online} type="radio"></input>
				</div>
				<div className="col-6 row">
					<p className="col-12">{this.state.login}</p>
				</div>
			</div>
		)
	}


	componentDidMount: any = async () => {
		let user = await Request('GET', {}, {}, "http://localhost:3000/user/" + this.state.id)
		this.setState({ login: user.username })
	}

	render() {
		let items: any = this.renderUserCards(this.state.id)
		return (
			<div>
				{items}
			</div>
		);
	}
}

export default UserCards;
