import {Component} from 'react';
import SearchBar from './SearchBar'


class OpenGames extends Component<{value : number}, {}> {
	renderGames(login: number) {
		return (
			<div key={login} className="gamesDiv row">
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
		while(x < this.props.value) {
			items.push(this.renderGames(x + 1))
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

	}

	render() {
		return (
			<div className="MatchNav">
				<div className="Wait m-2 p-2">
					<p>x games are waitting</p>
				</div> {/* Wait */}
				<div className="fastAccess">
					<button>Random matching</button>
					<div className="m-2 p-2">
						<SearchBar />
					</div>
				</div>
				<div className="List">
					<OpenGames value={1} />
				</div> {/* List */}
			</div>
		); // fin de return
	} // fin de render
} // fin de App

export default MatchNav;
