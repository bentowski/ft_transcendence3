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

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{ ctx: any; uslist: Array<string>; filteredList: Array<string>; friends: Array<UserType> }>, snapshot?: any) {
    const ctx: any = this.context;
    const frnds = ctx.friendsList;
    if (prevState.friends !== frnds) {
      this.setState({friends: frnds })
    }
  }

  componentDidMount = async () => {
    const ctx: any = this.context;
    const frnds = ctx.friendsList;
    this.setState({friends: frnds})
    //let ctx: any = this.context;
    //let currentUser = this.state.ctx.user;
    //let user = await Request('GET', {}, {}, "http://localhost:3000/user/name/" + this.state.user.username)
    //if (!user.friends.length)
      //return ;
    //this.setState({ friends: user.friends })
  }

  /*
  promptError = () => {
    let input = document.getElementById("InputAddFriends") as HTMLInputElement
    input.value = "This user not exist"
    setTimeout(() => {
      input.value = ""
    }, 1000);
  }
   */

  addFriends = async () => {
    const ctx: any = this.context;
    let currentUser: any = ctx.user;
    let input = document.getElementById("InputAddFriends") as HTMLInputElement
    if (input.value === "" || input.value === currentUser.username || this.state.friends.find((u: UserType) => u.username === input.value)) {
      input.value = '';
      return ;
    }
    try {
      let userToAdd = await Request('GET', {}, {}, "http://localhost:3000/user/name/" + input.value)
      let test = await Request('PATCH',
          {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          {
            action: true,
            auth_id: userToAdd.auth_id
          },
          "http://localhost:3000/user/update/friends"
      )
      ctx.updateFriendsList(userToAdd, true);
      let newFriendsArray = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/" + currentUser.auth_id + "/getfriends",
      )
      this.setState({friends: newFriendsArray})
      input.value = '';
    } catch (error) {
      ctx.setError(error);
    }
  }

  pressEnter = (e: any) => {
    const ctx: any = this.context;
    ctx.updateUserList();
    const uslist = ctx.userList;
    const query: any = e.target.value;
    let updatedList = [...uslist];
    console.log('updated list = ', updatedList);
    updatedList = updatedList.filter((item: any) => {
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
      return item.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    this.setState({ filteredList: updatedList })
    if (e.key === 'Enter') {
      this.addFriends();
    }
  }

  render() {

    let onlines;
    if (this.state.friends.length > 0)
    {
      onlines = 0;
      let x = 0;
      while (x < this.state.friends.length) {
        if (this.state.friends[x].status)
          onlines++;
        x++;
      }
    }

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
    ); // fin de return
  } // fin de render
} // fin de App
//

export default FriendsNav;
