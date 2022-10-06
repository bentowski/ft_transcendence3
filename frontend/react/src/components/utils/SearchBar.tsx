import {Component} from 'react';
import Request from "./Requests"

// class RequestUrl extends Component<{inputSelector : string, routeForRequest : string}, {}> {
// 	render() {
// 		let xhr:any;
// 		let MatchNav_SearchBar = (document.querySelector(this.props.inputSelector) as HTMLInputElement).value;
// 		let url = "http://localhost:3000/" + this.props.routeForRequest + MatchNav_SearchBar;
// 		xhr = new XMLHttpRequest();
//     	xhr.open("GET", url);
// 		xhr.responseType = 'json';
//     	xhr.send();
//     	xhr.onload = () => {
// 			return(xhr.response);
// 		}
// 		return xhr.response;
// 	}
// }

class SearchBar extends Component<{inputSelector : string, routeForRequest : string, parentCallBack : any}, {}> {
	state = {
		onload: 0
	}

	requestUrl = () => {
		let xhr:any;
		let MatchNav_SearchBar = (document.querySelector(this.props.inputSelector) as HTMLInputElement).value;
		let url = "http://localhost:3000/" + this.props.routeForRequest + MatchNav_SearchBar;
		xhr = new XMLHttpRequest();
    	xhr.open("GET", url);
		xhr.responseType = 'json';
    	xhr.send();
    	xhr.onload = () => {
			this.props.parentCallBack(xhr.response);
		}
	}

	onloadFct = () => {
		let xhr:any;
		let url = "http://localhost:3000/" + this.props.routeForRequest;
		xhr = new XMLHttpRequest();
    	xhr.open("GET", url);
		xhr.responseType = 'json';
    	xhr.send();
    	xhr.onload = () => {
			this.setState({onload: 1});
			this.props.parentCallBack(xhr.response);
		}
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
