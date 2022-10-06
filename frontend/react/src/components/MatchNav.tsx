//import React from 'react';
import { Component } from 'react';
import ModalMatch from "./utils/ModalMatch";
import SearchBar from './utils/SearchBar'
import Request from "./utils/Requests"


class OpenGames extends Component<{ allGames: any }, {}> {
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
		const items: any = []
		while (x < this.props.allGames.length) {
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
		allGames: []
	}

	callBackFunction = (childData: any) => {
		this.setState({ allGames: childData })
	}

	async reqUrl(request: string, url: string) {
		return await fetch(url, {
			method: request,
		}).then(response => response.json())
	}

	randomMatchmaking = () => {
		let url: string = "http://localhost:3000/parties";
		this.reqUrl("GET", url)
			.then((json) => {
				if (json.length === 0) {
					alert("No game found");
					return;
				}
				let randomUser: any = json[(Math.floor(Math.random() * json.length))];
				let games: any[] = this.state.allGames;
				let i = 0;
				for (; i < games.length; i++) {
					if (games[i].id === randomUser.id) {
						games.splice(i, 1);
						break;
					}
				}
				alert("Random game with : " + randomUser.login);
				this.setState({ allGames: games });
				fetch(url + '/' + randomUser.id, { method: 'DELETE' });
				//! insert connection to partie : log user vs randomUser.login
			})
			.catch((error) => {
				console.log("Random matchmaking error : " + error);
			});
	}

	prompt = () => {
		let modal = document.getElementById("ModalMatch") as HTMLDivElement;
		modal.classList.remove('hidden');
		// this.setState({modalType: "Avatar", modalTitle: "Change avatar"})
	}

	render() {
		return (
			<div className="MatchNav" id="MatchNav">
				<div className="Wait m-2 p-2">
					<p>{this.state.allGames.length} games found</p>
				</div> {/* Wait */}
				<ModalMatch title="Create new game" calledBy="newGame" />
				<div className="fastAccess">
					<button onClick={this.randomMatchmaking}>Random matching</button>
					<button onClick={this.prompt}>Create</button>
					<div className="m-2 p-2">
						<SearchBar inputSelector={"#MatchNav input"} routeForRequest={"parties/"} parentCallBack={this.callBackFunction} />
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
