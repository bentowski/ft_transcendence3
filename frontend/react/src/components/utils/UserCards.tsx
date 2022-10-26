import { Component } from 'react';
// import { Link } from "react-router-dom";
import Request from "./Requests"
import '../../styles/components/utils/userCards.css'
// import Login from '../../pages/Login';
import io from 'socket.io-client';

const socket = io('http://localhost:3000/chat');

class UserCards extends Component<{ user: any, avatar: boolean }, { login: string, id: number, online: string, ssname: string, ssid: string }> {
	constructor(props: any) {
		super(props);
		this.state = { login: "test", id: props.user.auth_id, online: this.props.user.online ? "online" : "offline", ssname: "", ssid: "" };
	}

	createChan = async () => {
		let chans = await Request("GET", {}, {}, "http://localhost:3000/chan");
		let u1 = await Request("GET", {}, {}, "http://localhost:3000/user/name/" + this.state.ssname);
		let u2 = await Request("GET", {}, {}, "http://localhost:3000/user/name/" + this.state.login);
		// console.log("length = ", chans.length);
		// console.log("u1.auth_id = ", u1.auth_id);
		// console.log("u2.auth_id = ", u2.auth_id);
		let x = 0;
		while (x < chans.length) {
			// console.log("chanUser.length = ", chans[x].chanUser.length);
			if (chans[x].type === "direct"
					&& ((chans[x].chanUser[0].auth_id === u1.auth_id && chans[x].chanUser[1].auth_id === u2.auth_id)
					|| (chans[x].chanUser[0].auth_id === u2.auth_id && chans[x].chanUser[1].auth_id === u1.auth_id))
			)
				break;
			
			x++;
		}
		console.log("x = ", x);
		if (x === chans.length) {
			await Request(
				"POST",
				{
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				{
					name: u1.username + "$" + u2.username,
					type: "direct",
					topic: u1.username + "$" + u2.username,
					admin: [u1.username, u2.username],
					password: "",
					chanUser: [u1, u2],
				},
				"http://localhost:3000/chan/create"
			);
			socket.emit('chanCreated');
		}
	}

	renderUserCards = (id: number) => {
		if (this.props.avatar) {
			return (
				<div key={id} className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center m-2">
					<div className="col-3 h-100 overflow-hidden buttons">
						<button className="w-100 h-50" onClick={this.createChan}>chat</button>
						<button className="w-100 h-50">Play</button>
					</div>
					<div className="">
						<input className={this.state.online} type="radio"></input>
					</div>
					<div className="d-flex flex-row align-items-center">
						<a href={"/profil/#" + this.state.login} className="mx-2">{this.state.login}</a>
						<img src={this.props.user.avatar} className="miniAvatar" />
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
		let user = await Request('GET', {}, {}, "http://localhost:3000/user/id/" + this.state.id)
		console.log(user)
		if (user)
			this.setState({ login: user.username })
		let newUser: any = sessionStorage.getItem('data');
		newUser = JSON.parse(newUser);
		this.setState({ ssid: newUser.user.auth_id });
		this.setState({ ssname: newUser.user.username });
	}

	render() {
		console.log("ID :" + this.state.id)
		let items: any = this.renderUserCards(1)
		return (
			<div key={this.state.id * 5 / 3}>
				{items}
			</div>
		);
	}
}

export default UserCards;
