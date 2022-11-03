import { Component } from 'react';
import Request from "./utils/Requests"
import HistoryCards from "./utils/HistoryCards";
import UserCards from './utils/UserCards';

class History extends Component<{}, { users: Array<any>, histories: Array<any> }> {
  constructor(props: any) {
    super(props);
    this.state = {
      users: [],
      histories: []
    }
  }

  componentDidMount: any = async () => {
    // let histories = await Request('GET', {}, {}, "http://localhost:3000/parties/histories/all")
    // this.setState({histories: histories})
    let users = await Request('GET', {}, {}, "http://localhost:3000/user");
    users.sort(function (a: any, b: any) {
      return a.game_won - b.game_won;
    });
    this.setState({ users: users });
  }

  render() {
    // let histories: Array<any> = [];
    // let x = this.state.histories.length - 1;
    // while (x >= 0) {
    //   histories.push(<HistoryCards history={this.state.histories[x]} profil={""} />)
    //   x--;
    // }
    let user: Array<any> = [];
    let y = 0;
    while (y < this.state.users.length) {
      user.push(
        <div className="d-flex flex-row d-flex align-items-center">
          <div className="nb col-1 mr-2 d-flex flex-row justify-content-start">
            {y + 1}
          </div>
          <UserCards key={y} user={this.state.users[y]} avatar={true} stat={true} />
        </div>
      )
      y++;
    }
    return (
      <div className='History'>
        {user}
      </div>
    );
  }
}

export default History;
