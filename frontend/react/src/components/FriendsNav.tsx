import { Component } from "react";
import Request from "./utils/Requests";
import { UserType } from "../types"
import { AuthContext } from "../contexts/AuthProviderContext";
import '../styles/components/friendsnav.css';
import DisplayFriendsList from "./utils/DisplayFriendsList";
import { Alert } from "react-bootstrap";

class FriendsNav extends Component<{}, { uslist: Array<string>, filteredList: Array<string>, friends: Array<UserType>, alert: boolean }> {
  static contextType = AuthContext;

  constructor(props: any) {
    super(props)
    this.state = {
      friends: [],
      filteredList: [],
      uslist: [],
      alert: false
    };
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{ ctx: any; uslist: Array<string>; filteredList: Array<string>; friends: Array<UserType>; alert: boolean }>, snapshot?: any): void {
    const ctx: any = this.context;
    const frnds: UserType[] = ctx.friendsList;
    if (prevState.friends !== frnds) {
      this.setState({ friends: frnds })
    }
  }

  componentDidMount = async (): Promise<void> => {
    const ctx: any = this.context;
    const frnds: UserType[] = ctx.friendsList;
    this.setState({ friends: frnds })
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

  addFriends = async (): Promise<void> => {
    const ctx: any = this.context;
    let currentUser: UserType = ctx.user;
    let input = document.getElementById("InputAddFriends") as HTMLInputElement
    if (input.value === "" || input.value === currentUser.username || this.state.friends.find((u: UserType) => u.username === input.value)) {
      input.value = '';
      return;
    }
    try {
      // let allUsers: <Array
      const ctx: any = this.context;
      // ctx.userList;
      let exist: boolean = false;
      for (let x = 0; x < ctx.userList.length; x++) {
        if (ctx.userList[x] === input.value)
          exist = true;
      }
      if (exist) {
        this.setState({alert: false})
        let userToAdd: UserType = await Request(
          'GET',
          {},
          {},
          "http://localhost:3000/user/name/" + input.value
        )
        await Request('PATCH',
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
        this.setState({ friends: newFriendsArray })
        input.value = '';
      }
      else {
        this.setState({ alert: true })
      }
    } catch (error) {
      ctx.setError(error);
    }
  }

  pressEnter = (e: any): void => {
    const ctx: any = this.context;
    ctx.updateUserList();
    const uslist: string[] = ctx.userList;
    const query: string = e.target.value;
    let updatedList: string[] = [...uslist];
    //console.log('updated list = ', updatedList);
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
      //input.value = "";
    }
  }

  closeAlert = (): void => {
    // console.log('closing alert');
    this.setState({ alert: false });
  }

  render(): JSX.Element {

    let onlines: number = 0;
    if (this.state.friends.length > 0) {
      onlines = 0;
      let x: number = 0;
      while (x < this.state.friends.length) {
        if (this.state.friends[x].status)
          onlines++;
        x++;
      }
    }

    return (
      <div className="FriendsNav">
        <div className="numberFriendsOnline">
          <p>
            {onlines ? onlines + '/' +
                this.state.friends.length +
                " friends online" : 'You are friendless'}
          </p>
        </div>
        <div className="addFriends my-3">
          <input
              id="InputAddFriends"
              className="col-8"
              type="text"
              placeholder="login"
              onKeyDown={this.pressEnter}></input>
          <div>
            {this.state.alert ?
              <Alert
                  onClose={this.closeAlert}
                  variant="danger"
                  dismissible>{"This user don't exist"}</Alert> :
              // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
              <div />
            }
          </div>
          <div className="item-list">
            <ol>
              {this.state.filteredList.map((item: any, key: any) => (
                <li key={key}>{item}</li>
              ))}
            </ol>
          </div>
          <button
              className="col-2 mx-2 btn btn-outline-dark shadow-none"
              onClick={this.addFriends}>ADD</button>
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
