import {Component} from 'react';

class SearchBar extends Component {
	state = {

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
