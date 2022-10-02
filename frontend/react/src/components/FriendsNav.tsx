import { Component } from 'react';
import UserCards from './utils/UserCards'

class FriendsNav extends Component {
  state = {

  }
  // <User />

  render() {
    return (
      <div className="FriendsNav h-100 p-1 text-center">
        <div className="numberFriendsOnline m-2">
          <p>x/total friends online</p>
        </div>
        <div className="addFriends m-2">
          <input className="col-8" type="text" placeholder="login"></input>
          <button className="col-4" id='button'>ADD</button>
        </div>
        <UserCards value={6} avatar={true} />
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default FriendsNav;
