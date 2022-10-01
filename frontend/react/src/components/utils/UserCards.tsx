import { Component } from 'react';

class UserCards extends Component<{value:number, avatar:boolean}, {onload: number}> {
	state = {
		onload: 0
	}


		renderUserCards = async (id: number) => {
			const settings = {
				method: 'GET',
			}
			const response: any = await fetch("http://localhost:3000/user/" + id, settings)
			if (response.ok)
			{
				let login = await response.json().username;
				if (this.props.avatar)
				{
					return (
						<div key={id} className="friendsDiv row my-2">
							<div className="col-3">
								<button>Tchat</button>
								<button>Play</button>
							</div>
							<div className="col-3">
								<img src="online"/>
							</div>
							<div className="col-6 row">
								<p className="col-6">{login}</p>
								<img src="avatar" className="col-6"/>
							</div>
						</div>
					)
				}
				return (
					<div key={login} className="friendsDiv row my-2">
						<div className="col-3">
							<button>Chat</button>
							<button>Play</button>
						</div>
						<div className="col-3">
							<img src="online"/>
						</div>
						<div className="col-6 row">
							<p className="col-12">{login}</p>
						</div>
					</div>
				)
			}
		}

	onloadFct = async () => {
		let ret:any = [];

		let x = 0;
		while(x < 2) {
			ret.push(await this.renderUserCards(x + 1))
			x++;
		}
		console.log("ret : " + ret) //unexpected return
		return ret;
	}

	render() {
		let items:any = [];
		if (this.state.onload == 0)
		{
			this.onloadFct();
		}
		return (
			<div>
				{items}
			</div>
		);
	}
}

export default UserCards;
