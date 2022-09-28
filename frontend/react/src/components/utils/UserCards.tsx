import { Component } from 'react';

class UserCards extends Component<{value:number, avatar:boolean}, {ary:any}> {
	test()
	{
		async function test2()
		{
			const settings = {
				method: 'GET',
			}
			const response: any = await fetch('http://localhost:3000/user', settings)
			if (response.ok)
			{
				console.log("test");
				console.log(await response.json());
			}
			return response;
		}
		test2();
	}

	renderUserCards(login: number) {
		let print: string = "user" + login;
		if (this.props.avatar)
		{
			// console.log("test");
			return (
				<div key={login} className="friendsDiv row my-2">
					<div className="col-3">
						<button onClick={this.test}>Tchat</button>
						<button>Play</button>
					</div>
					<div className="col-3">
						<img src="online"/>
					</div>
					<div className="col-6 row">
						<p className="col-6">{print}</p>
						<img src="avatar" className="col-6"/>
					</div>
				</div>
			)
		}
		return (
			<div key={login} className="friendsDiv row my-2">
				<div className="col-3">
					<button onClick={this.test}>Chat</button>
					<button>Play</button>
				</div>
				<div className="col-3">
					<img src="online"/>
				</div>
				<div className="col-6 row">
					<p className="col-12">{print}</p>
				</div>
			</div>
		)
	}
	render() {
		let x = 0; //variable a changer selon le back
		const items:any = []
		while(x < this.props.value) {
			items.push(this.renderUserCards(x + 1))
			x++;
		}
		return (
			<div>
				{items}
			</div>
		);
	}
}

export default UserCards;
