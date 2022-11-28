import {Component, useEffect, useState} from 'react';
import Request from "./Requests"
import { socket } from '../../contexts/WebSocketContextUpdate';

function SearchBar({inputSelector, routeForRequest, parentCallBack}:{inputSelector: string, routeForRequest: string, parentCallBack: any}) {
	const [onload, setOnload] = useState<number>(0);
	const [value, setValue] = useState<string>('');
	// const [input]
	// state = {
	// 	onload: 0
	// }

	useEffect(() => {
		if (inputSelector === "MatchNav") {
			socket.on('onNewParty', () => {
				updateUrl()
			})
			return () => {
				socket.off('onNewParty');
			}
		}
	})

	const updateUrl = async () => {
		// let input = document.querySelector("#MatchNav input") as HTMLInputElement;
		// let value = input.value;
		let url = "http://localhost:3000/" + routeForRequest + value;
		let parties = await Request('GET', {}, {}, url);
		parentCallBack(parties);
	}

	const requestUrl = async (event:any) => {
		// parentCallBackValue(event.target.value)
		setValue(event.target.value)
		let url = "http://localhost:3000/" + routeForRequest + event.target.value;
		let parties = await Request('GET', {}, {}, url);
		parentCallBack(parties);
	}

	const onloadFct = async () => {
		let url = "http://localhost:3000/" + routeForRequest;
		let parties = await Request('GET', {}, {}, url);
		setOnload(1);
		parentCallBack(parties);
	}

	//const render = () => {
		if (onload === 0)
			onloadFct();
		return (
			<div className="SearchBar my-2">
				<p><input onChange={requestUrl} type= "text" placeholder="Search..." className="w-100" required/></p>
			</div>
		); // fin de return
	//} // fin de render
} // fin de App

export default SearchBar;
