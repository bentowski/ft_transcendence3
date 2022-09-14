import {Component} from 'react';
import User from './User'
import SearchBar from './SearchBar'
import Channels from './Channels'
import Messages from './Messages'

class Tchat extends Component {
  state = {
  }

  render() {
    return (
      <div className="tchat row">
        <div className="channels col-2">
          <button>Create Channel</button>
          <div className="channelsList">
            <p>Channel List (x)</p>
            <SearchBar />
            <Channels />
          </div> {/*fin channelsList*/}
        </div> {/*fin channels*/}
        <div className="tchatMain col-8">
          <div className="tchatMainTitle row">
            <h1 className="col-10">Channel Name</h1>
            <button className="col-2">Add Peoples</button>
          </div>{/*fin tchatMainTitle*/}
          <div className="messages row">
            <Messages value={15} />
          </div>{/*fin messages*/}
          <div className="row">
            <input className="col-10" type="text" placeholder="type your message"/>
            <button className="col-1">send</button>
          </div>
        </div> {/*fin tchatMain*/}
        <div className="tchatMembers col-2">
            <p> Channel's members (x) </p>
            <User value={2} avatar={false}/>
        </div>
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default Tchat;
