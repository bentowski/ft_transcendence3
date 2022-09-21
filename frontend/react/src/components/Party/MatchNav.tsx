//import React from 'react';
import {Component} from 'react';
import SearchBar from '../Friends/SearchBar'


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

class MatchNav extends Component {
		state = {
			nbGame: 1,
			allGames: []
		}

	callBackFunction = (childData:any) => {
		this.setState({allGames: childData})
	}

	render() {
		return (
			<div className="MatchNav" id="MatchNav">
				<div className="Wait m-2 p-2">
					<p>{this.state.allGames.length} games are waitting</p>
				</div> {/* Wait */}
				<div className="fastAccess">
					<button>Random matching</button>
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
