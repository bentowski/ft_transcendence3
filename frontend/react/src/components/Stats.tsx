import { Component } from "react";
import UserCards from "./utils/UserCards";
import { UserType } from "../types"
import {AuthContext} from "../contexts/AuthProviderContext";

class Stats extends Component<
  {},
  { users: Array<UserType>; histories: Array<any> }
> {
  static contextType = AuthContext;
  constructor(props: any) {
    super(props);
    this.state = {
      users: [],
      histories: [],
    };
  }

  componentDidUpdate(
      prevProps: Readonly<{}>,
      prevState: Readonly<{
        users: Array<UserType>;
        histories: Array<any> }>,
      snapshot?: any) {
    const ctx: any = this.context;
    const users: UserType[] = ctx.userList;
    users.sort(function (a: UserType, b: UserType) {
      return a.game_lost - b.game_lost;
    });
    users.sort(function (a: UserType, b: UserType) {
      return b.game_won - a.game_won;
    });
    if (prevState.users !== users) {
      this.setState({ users: users });
    }
  }

  componentDidMount = (): void => {
    const ctx: any = this.context;
    const users: UserType[] = ctx.userList;
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
      // console.log("avatar est un bon film = ", this.state.users[y]);
      user.push(
        <div key={y} className="col-12 d-flex flex-row d-flex align-items-center">
          {/* <div className="nb col-1 mr-2 d-flex flex-row justify-content-start"> */}
          <div className="col-1 d-flex justify-content-start">
            {y + 1}
          </div>
          <div className="col-11 d-flex justify-content-between">
            <UserCards
              user={this.state.users[y]}
              avatar={true}
              stat={true}
            // key={y}
            />
          </div>
        </div>
      );
      y++;
    }
    return (
      <div className="Stats">
        <h3 className="d-flex justify-content-start">Rank</h3>
        {user}
      </div>
    );
  }
}

export default Stats;