import { Component } from 'react';

class UserCards extends Component<{value:number, avatar:boolean}, {}> {
	state = {
		onload: 0
	}

	// test = () =>
	// {

	// 	test2(url);
	// 	return ("test");
	// }


		renderUserCards(id: number) {
			async function test(url: any)
			{
				const settings = {
					method: 'GET',
					body: null
				}
				const response: any = await fetch(url, settings)
				if (response.ok)
				{
					// console.log("test");
					// console.log(await response.json());
					return (await response.json());
				}
				return;
			}
			const url = "http://localhost:3000/user/" + id;
			console.log(url);
			let wtf: Promise<any> = test(url);
			// wtf = test(url);
			let login: string = JSON.stringify(wtf);
			console.log(login);
			if (this.props.avatar)
			{
				// console.log("test");
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

	onloadFct = () => {
		let ret:any = [];

		this.state.onload = 1;
		let x = 0; //variable a changer selon le back
		// const ret:any = []
		while(x < 2) {
			ret.push(this.renderUserCards(x + 1))
			x++;
		}
		return ret;
	}

	render() {
		let items:any = [];
		if (this.state.onload == 0)
			items = this.onloadFct();

		return (
			<div>
				{items}
			</div>
		);
	}
}

export default UserCards;
