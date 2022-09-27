import { Component } from 'react';
// import "./Menu.css"

class Menu extends Component {
	state = {

	}

	render() {
		return (
			<div className="Menu d-flex justify-content-between align-items-center">
				<div className="homeButtonDiv col-3 d-flex justify-content-start">
					<a className="homeButton" href="#">
						<img src="/icons/home.svg"/>
					</a>
				</div> {/* homeButtonDiv */}
				<div className="titleDiv">
					<h1 className="m-0">PONG</h1>
				</div> {/* titleDiv */}
				<div className="profilMenu d-flex justify-content-end align-items-center col-3">
					<div className="loginMenu px-2">
						<a href="#">
							<p className="m-0">login</p>
						</a>
					</div>
					<div className="avatarMenu">
						<a href="#">
							<img className="miniAvatar" src="/pictures/ivloisy.jpg" />
						</a>
					</div>

				</div> {/*profilMenu */}
			</div> //Menu
		); // fin de return
	} // fin de render
} // fin de App

export default Menu;
