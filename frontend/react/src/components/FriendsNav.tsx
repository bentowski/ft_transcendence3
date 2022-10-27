import { Component } from "react";
import UserCards from "./utils/UserCards";
import Request from "./utils/Requests";

class FriendsNav extends Component<{}, { friends: Array<any> }> {
  constructor(props: any) {
    super(props)
    this.state = {
      friends: [],
    };
  }

  componentDidMount: any = async () => {
    //console.log("test")
    let friends = await Request('GET', {}, {}, "http://localhost:3000/user/")
    //console.log("friends : "+ friends)
    if (!friends)
      return ;
    this.setState({ friends: friends })
    //console.log("FRIENDS : " + this.state.friends)
  }

  render() {
    let friends: Array<any> = [];
    // console.log("FRIENDS : " + this.state.friends)
    let onlines;
    if (this.state.friends.length > 0)
    {
      onlines = 0;
      let x = 0;
      while (x < this.state.friends.length) {
        if (this.state.friends[x].online)
          onlines++;
        friends.push(<UserCards key={x} user={this.state.friends[x]} avatar={true} />)
        x++;
      }
    }

    return (
      <div className="FriendsNav">
        <div className="numberFriendsOnline">
          <p>{onlines}/{this.state.friends.length} friends online</p>
        </div>
        <div className="addFriends my-3">
          <input className="col-8" type="text" placeholder="login"></input>
          <button className="col-2 mx-2">ADD</button>
          <div>
            {friends}
          </div>
        </div>
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default FriendsNav;
