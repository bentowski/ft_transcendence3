import { Component } from "react";
import UserCards from "./utils/UserCards";
import Request from "./utils/Requests";
import { UserType } from "../types"

class FriendsNav extends Component<{navigation: any}, { friends: Array<UserType> }> {
  constructor(props: any) {
    super(props)
    this.state = {
      friends: [],
    };
  }

  componentDidMount = async () => {
    let currentUser:any = sessionStorage.getItem('data');
    currentUser = JSON.parse(currentUser);
    let user = await Request('GET', {}, {}, "http://localhost:3000/user/name/" + currentUser.user.username)
    if (!user.friends.length)
      return ;
    this.setState({ friends: user.friends })
  }

  promptError = () => {
    let input = document.getElementById("InputAddFriends") as HTMLInputElement
    input.value = "This user not exist"
    setTimeout(() => {
      input.value = ""
    }, 1000);
  }

  addFriends = async () => {
    let currentUser:any = sessionStorage.getItem('data');
    currentUser = JSON.parse(currentUser);
    let input = document.getElementById("InputAddFriends") as HTMLInputElement
    if (input.value === "" || input.value === currentUser.user.username || this.state.friends.find((u: UserType) => u.username === input.value))
      return ;
    let userToAdd = await Request('GET', {}, {}, "http://localhost:3000/user/name/" + input.value)
    if (!userToAdd)
    {
      this.promptError()
      return ;
    }
    let newFriendsArray = this.state.friends
    newFriendsArray  = [...newFriendsArray , userToAdd];
    let test = await Request('PATCH',
        {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        {
          username: currentUser.user.username,
          friends: newFriendsArray
        },
        "http://localhost:3000/user/addFriends/" + currentUser.user.auth_id)
    if (!test)
      return ;
    this.setState({friends: newFriendsArray})
  }

  pressEnter = (e: any) => {
    if (e.key === 'Enter')
    this.addFriends();
  }

  render() {
    let friends: Array<any> = [];
    let onlines;
    if (this.state.friends.length > 0)
    {
      onlines = 0;
      let x = 0;
      while (x < this.state.friends.length) {
        if (this.state.friends[x].status)
          onlines++;
        friends.push(<UserCards key={x} user={this.state.friends[x]} avatar={true} stat={false} />)
        x++;
      }
    }

    return (
      <div className="FriendsNav">
        <div className="numberFriendsOnline">
          <p>{onlines}/{this.state.friends.length} friends online</p>
        </div>
        <div className="addFriends my-3">
          <input id="InputAddFriends" className="col-8" type="text" placeholder="login" onKeyDown={this.pressEnter}></input>
          <button className="col-2 mx-2" onClick={this.addFriends}>ADD</button>
          <div>
            {friends}
          </div>
        </div>
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default FriendsNav;
