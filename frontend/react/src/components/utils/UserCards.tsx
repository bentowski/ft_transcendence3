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
						<div key={id} className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center m-2">
							<div className="col-3 h-100 overflow-hidden" id='buttons'>
								<button className="w-100 h-50">Tchat</button>
								<button className="w-100 h-50">Play</button>
							</div>
							<div className="">
								<img src="online"/>
							</div>
							<div className="d-flex flex-row align-items-center">
								<p className="mx-2">{this.state.login}</p>
								<img src="avatar" className="miniAvatar h-100 w-100"/>
							</div>
						</div>
					)
				}
				return (
					<div key={id} className="friendsDiv row my-2">
						<div className="col-3" id='button'>
							<button id='buttons'>Chat</button>
							<button id='buttons'>Play</button>
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
