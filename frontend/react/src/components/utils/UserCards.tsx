import { Component } from 'react';

class UserCards extends Component<{value:number, avatar:boolean}, {login: string, id: number}> {
	constructor(props: any) {
	 super(props);
	 this.state = { login: "test", id: props.value };
	}


		renderUserCards = (id: number) => {

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
								<p className="col-6">{this.state.login}</p>
								<img src="avatar" className="col-6"/>
							</div>
						</div>
					)
				}
				return (
					<div key={id} className="friendsDiv row my-2">
						<div className="col-3">
							<button>Chat</button>
							<button>Play</button>
						</div>
						<div className="col-3">
							<img src="online"/>
						</div>
						<div className="col-6 row">
							<p className="col-12">{this.state.login}</p>
						</div>
					</div>
				)
		}


	componentDidMount: any = async () => {
		const settings = {
			method: 'GET',
		}
		const url: string = "http://localhost:3000/user/" + this.state.id;
		const response: any = await fetch(url, settings)
		if (response.ok)
		{
			let user: any = await response.json();
			this.setState({login: user.username})
		}
	}

	render() {
		let items: any = this.renderUserCards(this.state.id)
		return (
			<div>
				{items}
			</div>
		);
	}
}

export default UserCards;
