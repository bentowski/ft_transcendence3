import { Component } from 'react';

class UserCards extends Component<{value:number, avatar:boolean}, {ary:any}> {
	test()
	{
		async function test2()
		{
			const settings = {
				method: 'GET',
			}
			const response: any = await fetch('http://localhost:3000/first-route', settings)
			if (response.ok)
			{
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
			return (
				<div key={login} className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center m-2">
					<div className="col-3 h-100 overflow-hidden" id='buttons'>
						<button className="w-100 h-50" onClick={this.test}>Tchat</button>
						<button className="w-100 h-50">Play</button>
					</div>
					<div className="">
						<img src="online"/>
					</div>
					<div className="d-flex flex-row align-items-center">
						<p className="mx-2">{print}</p>
						<img src="/pictures/ivloisy.jpg" className="miniAvatar h-100 w-100"/>
					</div>
				</div>
			)
		}
		return (
			<div key={login} className="friendsDiv row my-2">
				<div className="col-3" id='button'>
					<p>coucou</p>
					<button id='buttons'>Chat</button>
					<button id='buttons'>Play</button>
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
