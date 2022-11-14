import { Component } from "react";
import UserCards from "./utils/UserCards";
import Request from "./utils/Requests";
import { UserType } from "../types"
import {AuthContext} from "../contexts/AuthProviderContext";
import '../styles/components/friendsnav.css';
import DisplayFriendsList from "./utils/DisplayFriendsList";

class FriendsNav extends Component<{}, { uslist: Array<string>, filteredList: Array<string>, friends: Array<UserType> }> {
  static contextType = AuthContext;
  constructor(props: any) {
    super(props)
    this.state = {
      friends: [],
      filteredList: [],
      uslist: [],
    };
  }

  componentDidMount = async () => {
    let ctx: any = this.context;
    let currentUser = ctx.user;
    let user = await Request('GET', {}, {}, "http://localhost:3000/user/name/" + currentUser.username)
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
    const ctx: any = this.context;
    let currentUser: any = ctx.user;
    let input = document.getElementById("InputAddFriends") as HTMLInputElement
    if (input.value === "" || input.value === currentUser.username || this.state.friends.find((u: UserType) => u.username === input.value))
      return ;
    try {
      let userToAdd = await Request('GET', {}, {}, "http://localhost:3000/user/name/" + input.value)
      //let newFriendsArray = this.state.friends
      //newFriendsArray  = [...newFriendsArray , userToAdd];
      let test = await Request('PATCH',
          {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          {
            action: true,
            auth_id: userToAdd.auth_id
          },
          "http://localhost:3000/user/updatefriend/")
      console.log('updatefriendslist = ', userToAdd.auth_id);
      ctx.updateFriendsList(userToAdd, true);
      let newFriendsArray = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/" + currentUser.auth_id + "/getfriends",
      )
      this.setState({friends: newFriendsArray})
    } catch (error) {
      //const ctx: any = this.context;
      //console.log('error - ', error);
      ctx.setError(error);
    }
  }

  pressEnter = (e: any) => {
    const ctx: any = this.context;
    const uslist = ctx.userList;
    const query: any = e.target.value;
    let updatedList = [...uslist];
    updatedList = updatedList.filter((item: any) => {
      //console.log('item = ', item.toLowerCase().indexOf());
      if (e.target.value.length === 0) {
        return null;
      }
      for (let index = 0; index < this.state.friends.length; index++) {
        if (item === this.state.friends[index].username) {
          return null;
        }
      }
      if (item === ctx.user.username) {
        return null;
      }
      //console.log('output = ', item.toLowerCase().indexOf(query.toLowerCase()))
      return item.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    this.setState({ filteredList: updatedList })
    if (e.key === 'Enter')
    this.addFriends();
  }

  render() {
    let friends = [];
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
    console.log('friends      ',  this.state.friends);

    return (
      <div className="FriendsNav">
        <div className="numberFriendsOnline">
          <p>{onlines ? onlines + '/' + this.state.friends.length + " friends online": 'You are friendless'} </p>
        </div>
        <div className="addFriends my-3">
          <input id="InputAddFriends" className="col-8" type="text" placeholder="login" onKeyDown={this.pressEnter}></input>
          <div className="item-list">
            <ol>
              {this.state.filteredList.map((item: any, key: any) => (
                  <li key={key}>{item}</li>
              ))}
            </ol>
          </div>
          <button className="col-2 mx-2" onClick={this.addFriends}>ADD</button>
          <div>
            <DisplayFriendsList />
          </div>
        </div>
      </div>
    ); // fin de return    {friends}
  } // fin de render
} // fin de App
//

export default FriendsNav;
