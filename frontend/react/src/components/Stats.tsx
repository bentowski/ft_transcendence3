import { Component } from "react";
import Request from "./utils/Requests";
import UserCards from "./utils/UserCards";
import { UserType } from "../types"

class Stats extends Component<
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

  componentDidMount = async (): Promise<void> => {
    const ctx: any = this.context;
    let users: UserType[] = [];
    try {
      users = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user"
      );
    } catch (error) {
      ctx.setError(error);
    }
    if (!users) {
      return;
    }
    users.sort(function (a: UserType, b: UserType) {
      return a.game_lost - b.game_lost;
    });
    users.sort(function (a: UserType, b: UserType) {
      return b.game_won - a.game_won;
    });
    this.setState({ users: users });
  };

  render(): JSX.Element {
    let user: JSX.Element[] = [];
    let y: number = 0;
    while (y < this.state.users.length) {
      user.push(
        <div key={y} className="d-flex flex-row d-flex align-items-center">
          <div className="nb col-1 mr-2 d-flex flex-row justify-content-start">
            {y + 1}
          </div>
          <UserCards
            user={this.state.users[y]}
            avatar={true}
            stat={true}
          />
        </div>
      );
      y++;
    }
    return (
      <div className="Stats">
        <h1>Rank</h1>
        {user}
      </div>
    );
  }
}

export default Stats;
