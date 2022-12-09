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
  }

  addFriends = async (): Promise<void> => {
    const ctx: any = this.context;
    const currentUser: UserType = ctx.user;
    const input = document.getElementById("InputAddFriends") as HTMLInputElement
    if (input.value === "" || input.value === currentUser.username || this.state.friends.find((u: UserType) => u.username === input.value)) {
      input.value = '';
      return;
    }
    try {
      const ctx: any = this.context;
      let exist: boolean = false;
      for (let x = 0; x < ctx.userList.length; x++) {
        if (ctx.userList[x] === input.value)
          exist = true;
      }
      if (exist) {
        this.setState({ alert: false })
        const userToAdd: UserType = await Request(
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
        const newFriendsArray = await Request(
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
      <div className="FriendsNav col-12">
        <img className="pat" src="/pictures/pat.png" alt="pat" />
        <div className="numberFriendsOnline col-12">
          <p>
            {onlines ? onlines + '/' +
              this.state.friends.length +
              " friends online" : 'You are friendless'}
          </p>
        </div>
        <div className="addFriends my-3 col-12">
          <div className="divAddFriend d-flex flex-row px-2 col-12">
            <div className="inputDrop col-8 d-flex justify-content-start">
              <input
                id="InputAddFriends"
                className="col-12 d-flex justify-content-start"
                type="text"
                placeholder="login"
                onKeyDown={this.pressEnter}>

              </input>
              <div className="item-list">
                <ol>
                  {this.state.filteredList.map((item: any, key: any) => (
                    <li className="d-flex justify-content-start p-1" key={key}>{item}</li>
                  ))}
                </ol>
              </div>

            </div>
            <button
              className="btnAddUser col-4 ml-2"
              onClick={this.addFriends}>ADD</button>
          </div>
          <div>
            <div>
              {this.state.alert ?
                <Alert
                  onClose={this.closeAlert}
                  variant="danger"
                  dismissible>{"This user doesn't exist"}</Alert> :
                // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                <div />
              }
            </div>
            <DisplayFriendsList />
          </div>
        </div>
      </div>
    ); // fin de return
  } // fin de render
} // fin de App
//

export default FriendsNav;
