import { Component } from "react";
import Request from "./utils/Requests";
import UserCards from "./utils/UserCards";
import { UserType } from "../types"
import '../styles/components/stats.css';

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
        <div className="divUserStats">
          <div className="divStats">
            {user}
          </div>
        </div>
      </div>
    );
  }
}

export default Stats;