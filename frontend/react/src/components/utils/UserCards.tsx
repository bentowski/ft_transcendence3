import { Component } from 'react';
import Request from "./Requests"

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
							<div className="col-3 h-100 overflow-hidden buttons">
								<button className="w-100 h-50">Tchat</button>
								<button className="w-100 h-50">Play</button>
							</div>
							<div className="">
								<img src="online" alt=""/>
							</div>
							<div className="d-flex flex-row align-items-center">
								<p className="mx-2">{this.state.login}</p>
								<img src="avatar" className="miniAvatar h-100 w-100" alt=""/>
							</div>
						</div>
					)
				}
				return (
					<div key={id} className="friendsDiv row my-2">
						<div className="col-3 button">
							<button className="buttons">Chat</button>
							<button className="buttons">Play</button>
						</div>
						<div className="col-3">
							<img src="online" alt=""/>
						</div>
						<div className="col-6 row">
							<p className="col-12">{this.state.login}</p>
						</div>
					</div>
				)
		}


	componentDidMount: any = async () => {
		let user = await Request('GET', {}, {}, "http://localhost:3000/user/" + this.state.id)
		this.setState({login: user.username})
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
