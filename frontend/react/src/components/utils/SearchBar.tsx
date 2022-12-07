import { useEffect, useState } from 'react';
import Request from "./Requests"
import { socket } from '../../contexts/WebSocketContextUpdate';
import { PartiesType } from "../../types";
import { useAuthData } from "../../contexts/AuthProviderContext";

function SearchBar({inputSelector, routeForRequest, parentCallBack}:{inputSelector: string, routeForRequest: string, parentCallBack: any}): JSX.Element {
	const [onload, setOnload] = useState<number>(0);
	const [value, setValue] = useState<string>('');
	const { setError } = useAuthData();

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

	const updateUrl = async (): Promise<void> => {
		// let input = document.querySelector("#MatchNav input") as HTMLInputElement;
		// let value = input.value;
		const url: string = "http://localhost:3000/" + routeForRequest + value;
		let parties: PartiesType[] = []
		try {
			parties = await Request(
				'GET',
				{},
				{},
				url
			);
		} catch (error) {
			setError(error);
		}
		parentCallBack(parties);
	}

	const requestUrl = async (event: any): Promise<void> => {
		setValue(event.target.value)
		const url: string = "http://localhost:3000/" + routeForRequest + event.target.value;
		let parties: PartiesType[] = [];
		try {
			parties = await Request(
				'GET',
				{},
				{},
				url
			);
		} catch (error) {
			setError(error);
		}
		parentCallBack(parties);
	}

	const onloadFct = async (): Promise<void> => {
		const url: string = "http://localhost:3000/" + routeForRequest;
		let parties: PartiesType[] = [];
		try {
			parties = await Request(
				'GET',
				{},
				{},
				url
			);
		} catch (error) {
			setError(error);
		}
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
