import { Component } from 'react';
import UserCards from './utils/UserCards'

class FriendsNav extends Component {
  state = {

  }

  render() {
    console.log("ffriends");
    let items:any = [];
    let x = 1;
    while(x < 3 ) {
      console.log("appel : " + x)
      items.push(<UserCards value={x} avatar={true}/>)
      x++;
    }
    return (
      <div className="FriendsNav">
		  	<div className="numberFriendsOnline">
					<p>x/total friends online</p>
				</div>
				<div className="addFriends my-3">
					<input className="col-8" type="text" placeholder="login"></input>
					<button className="col-2 mx-2">ADD</button>
          <div>
            {items}
          </div>
				</div>
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default FriendsNav;
