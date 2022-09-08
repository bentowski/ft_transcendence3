//import React from 'react';
import {Component} from 'react';
import SearchBar from './SearchBar'


class OpenGames extends Component<{allGames : any}, {}> {
	renderGames(login: string, key: number) {
		return (
			<div key={key} className="gamesDiv row">
				<div className="col-4"></div>
				<div className="col-2">
					<button>Join</button>
				</div>
				<div className="col-3">
					<p>game {login}</p>
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

/* class RequestUrl extends Component<{inputSelector : string, routeForRequest : string}, {}> {
	render() {
		let xhr:any;
		let MatchNav_SearchBar = (document.querySelector(this.props.inputSelector) as HTMLInputElement).value;
		let url = "http://localhost:3000/" + this.props.routeForRequest + MatchNav_SearchBar;
		xhr = new XMLHttpRequest();
    	xhr.open("GET", url);
		xhr.responseType = 'json';
    	xhr.send();
    	xhr.onload = () => {
			return(xhr.response);
		}
		return xhr.response;
	}
} */

class MatchNav extends Component {
		state = {
			allGames: []
		}

	test = () => {
		let xhr:any;
		let MatchNav_SearchBar = (document.querySelector("#MatchNav input") as HTMLInputElement).value;
		let url = "http://localhost:3000/search-bar/parties/" + MatchNav_SearchBar;
		xhr = new XMLHttpRequest();
    	xhr.open("GET", url);
		xhr.responseType = 'json';
    	xhr.send();
    	xhr.onload = () => {
			this.setState({allGames: xhr.response});
		}
		//<RequestUrl inputSelector={"#MatchNav input"} routeForRequest={"search-bar/parties/"}/>
	}

	render() {
		return (
			<div className="MatchNav" id="MatchNav">
				<div className="Wait m-2 p-2">
					<p>x games are waitting</p>
				</div> {/* Wait */}
				<div className="fastAccess">
					<button onClick={this.test} >Random matching</button>
					<div className="m-2 p-2">
						<SearchBar/>
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
