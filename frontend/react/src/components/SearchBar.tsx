import {Component} from 'react';

class RequestUrl extends Component<{inputSelector : string, routeForRequest : string}, {}> {
	render() {
		let xhr:any;
		let MatchNav_SearchBar = (document.querySelector(this.props.inputSelector) as HTMLInputElement).value;
		let url = "http://localhost:3000/" + this.props.routeForRequest + MatchNav_SearchBar;
		xhr = new XMLHttpRequest();
    	xhr.open("GET", url);
		xhr.responseType = 'json';
    	xhr.send();
    	xhr.onload = () => {
			return(xhr.response);
		}
		return xhr.response;
	}
}

class SearchBar extends Component/* <{inputSelector : string, routeForRequest : string}, {}> */ {
	state = {
		tester: 5
	}

	render() {
		return (
			<div className="SearchBar my-2">
				<p><input type= "text" placeholder="Search..." className="w-100" required/></p>
			</div>
		); // fin de return
	} // fin de render
} // fin de App

export default SearchBar;
