import { Component, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
// import "./Menu.css"

class Menu extends Component {
	state = {
		avatar: "https://avatars.dicebear.com/api/personas/undefined.svg",
	};

	componentDidMount = () => {
		let newUser:any = sessionStorage.getItem('data');
		newUser = JSON.parse(newUser);
		this.setState({avatar: newUser.user.avatar});
	} 

	render() {
		return (
			<div className="Menu d-flex justify-content-between align-items-center">
				<div className="homeButtonDiv col-3 d-flex justify-content-start">
					<Link to={"/"}>
						<img src="/icons/home.svg" alt=""/>
					</Link>
				</div> {/* homeButtonDiv */}
				<div className="titleDiv">
					<h1 className="m-0">PONG</h1>
				</div> {/* titleDiv */}
				<div className="profilMenu d-flex justify-content-end align-items-center col-3">
					<div className="loginMenu px-2">
						<Link to={"/profil"}>
							<p className="m-0">login</p>
						</Link>
					</div>
					<div className="avatarMenu">
						<Link to={"/profil"}>
							<img className="miniAvatar" width="150" height="150" src={this.state.avatar}  alt=""/>
						</Link>
					</div>

				</div> {/*profilMenu */}
			</div> //Menu
		); // fin de return
	} // fin de render
} // fin de App

export default Menu;
