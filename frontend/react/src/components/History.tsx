import { Component } from 'react';
import Request from "./utils/Requests"
import HistoryCards from "./utils/HistoryCards";

class History extends Component< {}, {histories: Array<any>} > {
  constructor(props: any) {
    super(props);
    this.state = {
      histories: []
    }
  }

  componentDidMount: any =async () => {
    let histories = await Request('GET', {}, {}, "http://localhost:3000/parties/histories/all")
    this.setState({histories: histories})
  }

  render() {
    let histories: Array<any> = [];
    let x = this.state.histories.length - 1;
    while (x >= 0) {
      histories.push(<HistoryCards history={this.state.histories[x]}/>)
      x--;
    }
    return (
      <div className='History'>
        <h2>History</h2>
        <div>
          {histories}
        </div>
      </div>
    );
  }
}

export default History;