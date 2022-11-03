import {Component} from 'react';
import Request from "./Requests"

class SearchBar extends Component<{inputSelector : string, routeForRequest : string, parentCallBack : any}, {}> {
	state = {
		onload: 0
	}

	requestUrl = async (event:any) => {
		let url = "http://localhost:3000/" + this.props.routeForRequest + event.target.value;
		let parties = await Request('GET', {}, {}, url);
		this.props.parentCallBack(parties);
	}

	onloadFct = async () => {
		let url = "http://localhost:3000/" + this.props.routeForRequest;
		let parties = await Request('GET', {}, {}, url);
		this.setState({onload: 1});
		this.props.parentCallBack(parties);
	}

	render() {
		if (this.state.onload === 0)
			this.onloadFct();
		return (
			<div className="SearchBar my-2">
				<p><input onChange={this.requestUrl} type= "text" placeholder="Search..." className="w-100" required/></p>
			</div>
		); // fin de return
	} // fin de render
} // fin de App

export default SearchBar;
