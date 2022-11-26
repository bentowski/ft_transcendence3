//import React from 'react';
import React, { Component, useEffect, useState } from 'react';
import { socket } from '../contexts/WebSocketContextUpdate';
import ModalMatch from "./utils/ModalMatch";
import SearchBar from './utils/SearchBar'
import Request from "./utils/Requests"


function OpenGames() {
	const [games, setGames] = useState<any[]>([]);
	const [items, setItems] = useState<any[]>([]);

	useEffect(() => {
		socket.on('onNewParty', () => {
			getGames()
		})
		return () => {
			socket.off('newParty');
		}
	});

	useEffect(() => {
		getGames()
	}, [])

	useEffect(() => {
		render()
	}, [games])

	const getGames = async () => {
		let parties = await Request('GET', {}, {}, "http://localhost:3000/parties")
		setGames(parties)
	}

	const renderGames = (login: string, key: number, id: number, p1: string, p2: string) => {
		let count = 0;
		if (p1 !== null)
			count++;
		if (p2 !== null)
			count++;
		return (
			<div key={key} className="gamesDiv text-nowrap d-flex justify-content-between">
				<div className="">
					<button onClick={() => window.location.href = "http://localhost:8080/game/" + id}>{(count === 2) ? "Spec" : "Join"}</button>
				</div>
				<div className="">
					<p className="text-start">{login}</p>
				</div>
				<div className="" >
					{count}/2
				</div>
			</div>
		)
	}
	const render = () => {
		let x = 0; //variable a changer selon le back
		const item: any = []
		while (x < games.length) {
			item.push(renderGames(games[x].login, x, games[x].id, games[x].p1, games[x].p2))
			x++;
		}
		setItems(item)
	}
	return (
		<div>
			{items}
		</div>
	)
}

class MatchNav extends Component {
	state = {
		allGames: []
	}

	callBackFunction = (childData: any) => {
		this.setState({ allGames: childData })
	}

	async reqUrl(request: string, url: string) {
		return await fetch(url, {
			method: request,
		}).then(response => response.json())
	}

	randomMatchmaking = async () => {
		const games = await Request('GET', {}, {}, "http://localhost:3000/parties")
		let availableGames = games.filter((game:any) => {
			if (game.p1 === null || game.p2 === null)
				return true;
			return false;
		})
		if (availableGames.length === 0) {
			alert("No available game joinable")
			return ;
		}
		let randomGame: any = availableGames[(Math.floor(Math.random() * availableGames.length))];
		window.location.href = "http://localhost:8080/game/" + randomGame.id
	}

	prompt = () => {
		let modal = document.getElementById("ModalMatch") as HTMLDivElement;
		modal.classList.remove('hidden');
	}

	render() {
		return (
			<div className="MatchNav h-100" id="MatchNav">
				<div className="Wait m-2 p-2">
					<p>{this.state.allGames.length} games found</p>
				</div> {/* Wait */}
				<ModalMatch title="Create new game" calledBy="newGame" />
				<div className="fastAccess">
					<button className="btn btn-outline-dark shadow-none" onClick={this.randomMatchmaking}>Random matching</button>
					<button className="mx-2 btn btn-outline-dark shadow-none" onClick={this.prompt}>Create</button>
					<div className="m-2 p-2">
						<SearchBar inputSelector={"#MatchNav input"} routeForRequest={"parties/"} parentCallBack={this.callBackFunction} />
					</div>
				</div>
				<div className="List">
					<OpenGames/>
				</div> {/* List */}
			</div>
		); // fin de return
	} // fin de render
} // fin de App

export default MatchNav;
