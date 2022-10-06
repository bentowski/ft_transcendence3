import { Component } from 'react';
import { Link } from "react-router-dom";
import Request from "./utils/Requests"
// import "./Menu.css"

class Menu extends Component {
	state = {

	}

	render() {
		return (
			<div className="Menu d-flex justify-content-between align-items-center">
				<div className="homeButtonDiv col-3 d-flex justify-content-start">
					<Link to={"/tchat"}>
							<p className="m-0">chat</p>
					</Link>
				</div> {/* homeButtonDiv */}
				<div className="titleDiv">
					<h1 className="m-0">PONG</h1>
				</div> {/* titleDiv */}
				<div className="profilMenu d-flex justify-content-end align-items-center col-3">
					<div className="loginMenu px-2">
						<Link to={"/profil/#user"}>
							<p className="m-0">login (recup by session storage)</p>
						</Link>
					</div>
					<div className="avatarMenu">
						<Link to={"/profil/#user"}>
							<img className="miniAvatar" src="/pictures/ivloisy.jpg"  alt=""/>
						</Link>
					</div>
					<div className="logoutMenu">
						<Link to={"/login"}>
							<p className="m-0">logout</p>
						</Link>
					</div>
				</div> {/*profilMenu */}
			</div> //Menu
		); // fin de return
	} // fin de render
} // fin de App

export default Menu;
