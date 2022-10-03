import { Component } from 'react';
import UserCards from './utils/UserCards'

class FriendsNav extends Component {
  state = {

  }

  render() {
    let items:any = [];
    let x = 1;
    while(x < 4 ) {
      console.log("appel : " + x)
      items.push(<UserCards value={x} avatar={true}/>)
      x++;
    }
    return (
      <div className="FriendsNav h-100 p-1">
		  	<div className="numberFriendsOnline m-2">
					<p>x/total friends online</p>
				</div>
				<div className="addFriends m-2 py-2">
					<input className="col-8" type="text" placeholder="login"></input>
					<button className="col-4" id='button'>ADD</button>
          <div>
            {items}
          </div>
				</div>
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default FriendsNav;
