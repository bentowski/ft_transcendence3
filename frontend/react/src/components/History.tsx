import { Component } from "react";
import Request from "./utils/Requests";
import UserCards from "./utils/UserCards";
import { UserType } from "../types"

class History extends Component<
  {},
  { users: Array<UserType>; histories: Array<any> }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      users: [],
      histories: [],
    };
  }

  componentDidMount = async () => {
    let users = await Request("GET", {}, {}, "http://localhost:3000/user");
    if (!users) return;
    users.sort(function (a: UserType, b: UserType) {
      return a.game_lost - b.game_lost;
    });
    users.sort(function (a: UserType, b: UserType) {
      return b.game_won - a.game_won;
    });
    this.setState({ users: users });
  };

  render() {
    let user: Array<any> = [];
    let y = 0;
    while (y < this.state.users.length) {
      console.log("avatar est un bon film = ", this.state.users[y]);
      user.push(
        <div className="d-flex flex-row d-flex align-items-center">
          <div className="nb col-1 mr-2 d-flex flex-row justify-content-start">
            {y + 1}
          </div>
          <UserCards
            key={y}
            user={this.state.users[y]}
            avatar={true}
            stat={true}
          />
        </div>
      );
      y++;
    }
    return <div className="History">{user}</div>;
  }
}

export default History;
