//import React from 'react';
import { AnyARecord } from 'dns';
import {Component} from 'react';
import SearchBar from './utils/SearchBar'


class OpenGames extends Component<{allGames : any}, {}> {
	renderGames(login: string, key: number) {
		return (
			<div key={key} className="gamesDiv row justify-content-start">
				<div className="col-4">
					<button>Join</button>
				</div>
				<div className="col w-100">
					<p className="text-start">game {login}</p>
				</div>
			</div>
		)
	}
	render() {
		let x = 0; //variable a changer selon le back
		const items:any = []
		while(x < this.props.allGames.length) {
			items.push(this.renderGames(this.props.allGames[x].login, x))
			x++;
		}
		return (
			<div>
				{items}
			</div>
		);
	}
}

class MatchNav extends Component {
		state = {
			allGames: [],
			reload: "",
		}

	callBackFunction = (childData:any) => {
		this.setState({allGames: childData})
	}

	randomMatchmaking = () => {
		let xhr:any;
		let url = "http://localhost:3000/parties";
		xhr = new XMLHttpRequest();
    	xhr.open("GET", url);
		xhr.responseType = 'json';
    	xhr.send();
    	xhr.onload = () => {
			let randomUser:any = xhr.response[(Math.floor(Math.random() * (this.state.allGames.length * 10))) % this.state.allGames.length];
			alert("Random game with : " + randomUser.login);
			let delUser:any = new XMLHttpRequest();
			delUser.open("DELETE", url + "/" + randomUser.id);
			console.log("tentative de delete : " + url + "/" + randomUser.id);
			delUser.onload = function () {}
			delUser.send();
			// this.setState({reload: randomUser.id});
		}
	}

	render() {
		return (
			<div className="MatchNav" id="MatchNav">
				<div className="Wait m-2 p-2">
					<p>{this.state.allGames.length} games found</p>
				</div> {/* Wait */}
				<div className="fastAccess">
					<button onClick={this.randomMatchmaking}>Random matching</button>
					<div className="m-2 p-2">
						<SearchBar inputSelector={"#MatchNav input"} routeForRequest={"parties/"} parentCallBack={this.callBackFunction}/>
					</div>
				</div>
				<div className="List">
				<OpenGames allGames={this.state.allGames} />
				</div> {/* List */}
			</div>
		); // fin de return
	} // fin de render
} // fin de App

export default MatchNav;
