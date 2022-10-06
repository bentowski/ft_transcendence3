import { Component } from 'react';
import Modal from "./utils/Modal";
// import socketio from "socket.io-client";
import UserCards from './utils/UserCards'

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


class Channels extends Component {
  state = {

  }

  render() {
    return (
      <div className="">
      </div>
    ); // fin de return
  } // fin de render
} // fin de Channels


// export const socket: any = socketio("http://localhost:3000");

// class Test{
//
// }

class Tchat extends Component<{}, {message: number}> {
  constructor(props: any)
  {
    super(props);
    this.state = {
      message: 0
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
    modal.classList.remove('hidden')
    const settings = {
      method:'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": "truc",
        "topic": "nimp",
        "password": "fuck"
      })
    }
    const response = await fetch("http://localhost:3000/chan/create", settings);
    if (response.ok)
    {
      console.log("ok");
    }
  }

  render() {
    let items:any = [];
    let x = 1;
    while(x < 4 ) {
      console.log("appel : " + x)
      items.push(<UserCards value={x} avatar={true}/>)
      x++;
    }
    return (
      <div className="tchat row">
        <Modal title='Modal'></Modal>
        <div className="channels col-2">
          <button onClick={this.createChan}>Create Channel</button>
          <div className="channelsList">
            <p>Channel List (x)</p>
            {/* <SearchBar /> */}
            <Channels />
          </div> {/*fin channelsList*/}
        </div> {/*fin channels*/}
        <div className="tchatMain col-8">
          <div className="tchatMainTitle row">
            <h1 className="col-10">Channel Name</h1>
            <button className="col-2">Add Peoples</button>
          </div>{/*fin tchatMainTitle*/}
          <div id="messages" className="messages row">
          </div>{/*fin messages*/}
          <div className="row">
            <input id="message" className="col-10" type="text" placeholder="type your message" onBlur={this.handleSubmitNewMessage}/>
            <button className="col-1" onClick={this.handleSubmitNewMessage}>send</button>
          </div>
        </div> {/*fin tchatMain*/}
        <div className="tchatMembers col-2">
            <p> Channnnnel's members (x) </p>
            {items}
        </div>
      </div>
    ); // fin de return
  } // fin de render
  // <UserCards value={2} avatar={false}/>
} // fin de App

export default Tchat;
