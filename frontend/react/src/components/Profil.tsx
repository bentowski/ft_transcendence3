import {Component} from 'react';
import Request from "./utils/Requests"

class History extends Component<{value:number}, {}> {
	renderHistory(login: string, x: number) {
		return (
			<div key={x} className="friendsDiv row">
				<div className="col-1">
					<p>score 1</p>
				</div>
				<div className="col-1">
					<p>-</p>
				</div>
				<div className="col-1">
					<p>score 2</p>
				</div>
				<div className="col-6">
					<p>win/loose</p>
				</div>
				<p className="col-2">{login}</p>
				<img src="avatar" className="col-1 rounded-circle" alt=""/>
			</div>
		)
	}
	render() {
		let x = 0; //variable a changer selon le back
		const items:any = []
		while(x < this.props.value) {
			items.push(this.renderHistory("friends 1", x))
			x++;
		}
		return (
			<div>
				{items}
			</div>
		);
	}
}

class Profil extends Component {
	state = {

	}

	render() {
		return (
			<div className="Profil">
				<div className="ProfilHeader">
					<div className="ProfilInfoPers">
						<a href="src/components/Profil#">
							<img className="modifAvatar mb-2"  src="/pictures/ivloisy.jpg"  alt=""/>
						</a>
						<a className="modifName" href="src/components/Profil#">
							<h3>login</h3>
						</a>
					</div> {/* fin ProfilInfPer */}
					<div className=" mt-5 pt-5">
						<History value={7} />
					</div>
				</div> {/* fin ProfilHeader*/}
			</div>
		); // fin de return
	} // fin de render
} // fin de App

export default Profil;
