import { Component } from 'react';
import User from './User'

class FriendsNav extends Component {
  state = {

  }
  // <User />

  render() {
    return (
      <div className="FriendsNav">
		  	<div className="numberFriendsOnline">
					<p>x/total friends online</p>
				</div>
				<div className="addFriends my-3">
					<input className="col-8" type="text" placeholder="login"></input>
					<button className="col-2 mx-2">ADD</button>
          <User value={6} avatar={true}/>
				</div>
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default FriendsNav;
