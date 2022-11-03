import { Component } from 'react';
import { Link, Navigate, redirect } from "react-router-dom";
import io from 'socket.io-client';
import Request from "./Requests"
import '../../styles/components/utils/userCards.css'


const socket = io('http://localhost:3000/chat');

class UserCards extends Component<{ user: any, avatar: boolean }, { login: string, id: number, online: string, ssname: string, ssid: string, chanId: string }> {
	constructor(props: any) {
		super(props);
		this.state = { login: "test", id: props.user.auth_id, online: this.props.user.online ? "online" : "offline", ssname: "", ssid: "", chanId: "" };
	}

	createChan = async () => {
		let chans = await Request("GET", {}, {}, "http://localhost:3000/chan");
		let u1 = await Request("GET", {}, {}, "http://localhost:3000/user/name/" + this.state.ssname);
		let u2 = await Request("GET", {}, {}, "http://localhost:3000/user/name/" + this.state.login);
		let ret = 0;
		let x = 0;
		while (x < chans.length) {
			if (chans[x].type === "direct"
				&& ((chans[x].chanUser[0].auth_id === u1.auth_id && chans[x].chanUser[1].auth_id === u2.auth_id)
					|| (chans[x].chanUser[0].auth_id === u2.auth_id && chans[x].chanUser[1].auth_id === u1.auth_id))
			)
			{
				ret = chans[x].id;
				break;
			}

			x++;
		}
		if (x === chans.length) {
			let newChan = await Request(
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
			let newUrl = "http://localhost:8080/tchat/#" + newChan.id
			let title = 'test'
			setTimeout(() => {
				window.location.href = newUrl
			}, 100)
			return ;
		}
		let newUrl = "http://localhost:8080/tchat/#" + ret
		window.location.href = newUrl
	}

	renderUserCards = (id: number) => {
		if (this.props.avatar) {
			return (
				<div key={id} className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center">
					<div className="col-5 h-100 overflow-hidden buttons">
							<button className=" p-1" onClick={this.createChan}>
								<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-chat-left-dots" viewBox="0 0 16 16">
									<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
									<path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
								</svg>
							</button>
						<Link to={"/game"}>
							<button className="mx-2 p-1">
								<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-joystick" viewBox="0 0 16 16">
									<path d="M10 2a2 2 0 0 1-1.5 1.937v5.087c.863.083 1.5.377 1.5.726 0 .414-.895.75-2 .75s-2-.336-2-.75c0-.35.637-.643 1.5-.726V3.937A2 2 0 1 1 10 2z" />
									<path d="M0 9.665v1.717a1 1 0 0 0 .553.894l6.553 3.277a2 2 0 0 0 1.788 0l6.553-3.277a1 1 0 0 0 .553-.894V9.665c0-.1-.06-.19-.152-.23L9.5 6.715v.993l5.227 2.178a.125.125 0 0 1 .001.23l-5.94 2.546a2 2 0 0 1-1.576 0l-5.94-2.546a.125.125 0 0 1 .001-.23L6.5 7.708l-.013-.988L.152 9.435a.25.25 0 0 0-.152.23z" />
								</svg>
							</button>
						</Link>
					</div>
					<div className="col-2 d-flex flex-row d-flex justify-content-center">
						<input className={this.state.online} type="radio"></input>
					</div>
					<div className="col-5 d-flex flex-row justify-content-end align-items-center">
						<Link to={"/profil/" + this.state.login} className="mx-2">{this.state.login}</Link>
						<img src={this.props.user.avatar} className="miniAvatar" />
					</div>
				</div>
			)
		}

		return (
			<div key={id} className="friendsDiv row my-2">
				<div className="col-6">
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
		if (user)
			this.setState({ login: user.username })
		let newUser: any = sessionStorage.getItem('data');
		newUser = JSON.parse(newUser);
		this.setState({ ssid: newUser.user.auth_id });
		this.setState({ ssname: newUser.user.username });
	}

	render() {
		let items: any = this.renderUserCards(1)
		return (
			<div key={this.state.id * 5 / 3} className="my-2">
				{items}
			</div>
		);
	}
}

export default UserCards;
