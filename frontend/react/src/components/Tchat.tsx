import { Component } from 'react';
import Modal from "./utils/Modal";
// import socketio from "socket.io-client";
import UserCards from './utils/UserCards'
import Request from "./utils/Requests"

//
// class Messages extends Component<{value : number}, {}> {
//   renderMessage(origin: string, x: number) {
//     if (origin == "own")
//     {
//       return (
//         <div key={x} className="row">
//           <div className="left col-6">
//           </div>
//           <div className="rigth col-6">
//             <p>messages own</p>
//           </div>
//         </div>
//       )
//     }
//     else
//     {
//       return (
//         <div key={x} className="row">
//           <div className="left col-6">
//             <p>messages others</p>
//           </div>
//           <div className="rigth col-6">
//           </div>
//         </div>
//       )
//     }
//   }
//
//
//   render() {
//     let x = 0;
//     let origin = "";
//     const items = [];
//     while (x < this.props.value)
//     {
//       if (x % 3)
//         origin = "other";
//       else
//         origin = "own";
//       items.push(this.renderMessage(origin, x))
//       x++;
//     }
//     return (
//       <div className="row">
//         {items}
//       </div>
//     ); // fin de return
//   } // fin de render
// } // fin de Message


class Channels extends Component<{id: number}, {name: string}> {
  constructor(props: any)
  {
    super(props)
    this.state = { name: "" }
  }

  renderUserCards = (id: number) => {

    }

  componentDidMount: any = async () => {
    let chan = await Request('GET', {}, {}, "http://localhost:3000/chan/" + this.props.id)
    this.setState({name: chan.name})
  }

  render() {
    // let items: any = this.renderUserCards(this.state.id)
    return (
      <div key={this.props.id} className="d-flex flex-row d-flex justify-content-between align-items-center m-2">
        <div className="">
          <a href="/tchat">{this.state.name}</a>
        </div>
      </div>
    ) // fin de return
  } // fin de render
} // fin de Channels


// export const socket: any = socketio("http://localhost:3000");

// class Test{
//
// }

class Tchat extends Component<{}, {message: number, chans: any, userChan: any, modalType: string, modalTitle: string}> {
  constructor(props: any)
  {
    super(props);
    this.state = {
      message: 0,
      modalType: "",
      modalTitle: "",
      chans: [],
      userChan: []
    }

  //   socket.on('message', ({ data }: any) => {
  //     console.log("GOOD" + data);
  //     console.log(socket.id);
  //     if (this.state.message != 0)
  //       this.handleNewMessage(data, this.state.message);
  //   });
  // }
  //
  // handleNewMessage = (message: any, x: number) => {
  //   const messages = document.getElementById('messages') as HTMLElement;
  //   messages.appendChild(this.buildNewMessage(message, x));
  // }
  //
  // buildNewMessage = (message: any, x: number) => {
  //     console.log(message);
  //     const li = document.createElement("li");
  //     li.appendChild(document.createTextNode(message));
  //     li.setAttribute("id", "" + x);
  //     console.log("child");
  //     return li;
  //   }
  //
  // requestUrl = () => {
	// 	let xhr:any;
	// 	let url = "http://localhost:3000/user";
	// 	xhr = new XMLHttpRequest();
  //   	xhr.open("GET", url);
	// 	xhr.responseType = 'json';
  //   	xhr.send();
  //   	xhr.onload = () => {
	// 	}
	}


  promptAddUser = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove('hidden');
    this.setState({modalType: "addUser", modalTitle: "Add an user"})
  }

  handleSubmitNewMessage = () => {
      // const message = document.getElementById('message') as HTMLInputElement
      console.log("submit " /*+ message.value*/);
      // async function test()
      // {
      //   const settings = {
      //     method:'GET',
      //   }
      //   const response = await fetch("localhost:3000:user", settings);
      //   console.log(response.blob);
      // }
      // test();

      // .then(function(response){
      // });
      // socket.emit('message', {data: message.value });
      // this.setState({message: this.state.message + 1})
      // message.value = "";

  }

  createChan = async () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove('hidden');
    this.setState({modalType: "newChan", modalTitle: "Create a new channel"})
    await Request(
                        'POST',
                        {
                          Accept: 'application/json',
                          'Content-Type': 'application/json'
                        },
                        {
                          "name": "truc",
                          "topic": "nimp",
                          "admin": ["test"],
                          "password": "fuck"
                        },
                        "http://localhost:3000/chan/create"
                      )
  }

  componentDidMount: any = async () => {
    let chans = await Request('GET', {}, {}, "http://localhost:3000/chan/")
			this.setState({chans: chans})
	}

  render() {
    let users:any = [];
    let x = 0;
    while(x < this.state.userChan.length ) {
      users.push(<UserCards value={this.state.userChan[x].auth_id} avatar={true} online={this.state.userChan[x].online}/>)
      x++;
    }
    let chans:any = []
    x = 0
    while(x < this.state.chans.length) {
      chans.push(<Channels id={this.state.chans[x].name} />)
      x++;
    }
    return (
      <div className="tchat row">
        <Modal title={this.state.modalTitle} calledBy={this.state.modalType}/>
        <div className="channels col-2">
          <button onClick={this.createChan}>Create Channel</button>
          <div className="channelsList">
            <p>{this.state.chans.length} Channels</p>
            {/* <SearchBar /> */}
            {chans}
          </div> {/*fin channelsList*/}
        </div> {/*fin channels*/}
        <div className="tchatMain col-8">
          <div className="tchatMainTitle row">
            <h1 className="col-10">Channel Name</h1>
            <button className="col-2" onClick={this.promptAddUser}>Add Peoples</button>
          </div>{/*fin tchatMainTitle*/}
          <div id="messages" className="messages row">
          </div>{/*fin messages*/}
          <div className="row">
            <input id="message" className="col-10" type="text" placeholder="type your message" onBlur={this.handleSubmitNewMessage}/>
            <button className="col-1" onClick={this.handleSubmitNewMessage}>send</button>
          </div>
        </div> {/*fin tchatMain*/}
        <div className="tchatMembers col-2">
            <p> Channnnnel's members ({this.state.userChan.length}) </p>
            {users}
        </div>
      </div>
    ); // fin de return
  } // fin de render
  // <UserCards value={2} avatar={false}/>
} // fin de App

export default Tchat;
