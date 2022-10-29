import { Component, useContext, useEffect, useState, useRef } from 'react';
import Modal from "./utils/Modal";
// import socketio from "socket.io-client";
import UserCards from './utils/UserCards'
import Request from "./utils/Requests"

import { socket, WebsocketProvider, WebsocketContext } from '../contexts/WebSocketContext';
// import { wait } from '@testing-library/user-event/dist/utils';
// import { setTimeout } from 'timers';
// import { off } from 'process';
// import { channel } from 'diagnostics_channel';

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

  // renderUserCards = (id: number) => {
  //
  //   }

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


 //export const socket: any = socketio("http://localhost:3000");

// class Test{
//
// }

type MessagePayload = {
  content: string;
  msg: string;
  username: string;
  avatar: string;
  sender_socket_id: string;
  room: string;
};

type chanType = {
	id: string;
	type: string;
	name: string;
	admin: string[];
	topic: string;
	password: string;
	isActive: boolean;
	messages: MessagePayload[];
	chanUser: any[];
  };

export const WebSocket = () => {
  const [value, setValue] = useState('');
  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [auth_id, setAuthId] = useState('');
  const [room, setRoom] = useState('');
  const [chans, setChans] = useState<chanType[]>([]);
  const [messages, setMessage] = useState<MessagePayload[]>([]);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [loaded, setLoaded] = useState('');

  const socket = useContext(WebsocketContext);
  const msgInput = useRef<HTMLInputElement>(null)

  useEffect( () => {
    socket.on('connect', () => {
    });
    socket.on('onMessage', (newMessage: MessagePayload) => {
		let channels:chanType[] = chans;
		let index:number = chans.findIndex((c:any) => c.id === newMessage.room);
		if (channels[index] !== undefined) {
			if (channels[index].messages)
				channels[index].messages = [...channels[index].messages, newMessage];
			else
				channels[index].messages = [newMessage];
			setChans(channels);
				if (channels[index].isActive) {
				if (channels[index].messages)
					setMessage(channels[index].messages);
				else
					setMessage([])
			}
		}
    });

      socket.on('newChan', () => {
        getChan();
      });

	  socket.on('userJoinChannel', () => {
		getChan();
	  })

	  if (msgInput.current)
	  	msgInput.current.focus();

    return () => {
      socket.off('connect');
      socket.off('onMessage');
      socket.off('newChan');
	  socket.off('userJoinChannel');
	  chans.map((c:any) => {
		if (c.chanUser) {
			c.chanUser.map((u:any) => {
				if (u.auth_id === auth_id)
					socket.emit('leaveRoom', c.id, auth_id);
			})
		}
	  })
    }
  });

  	useEffect(() => {
		let newUser:any = sessionStorage.getItem('data');
		newUser = JSON.parse(newUser);
		getChan();
		setAvatar(newUser.user.avatar);
    	setUsername(newUser.user.username);
		setAuthId(newUser.user.auth_id);
  	}, [])
	
	useEffect(() => {
		if (loaded === 'ok')
			joinUrl()
	}, [loaded])

	useEffect(() => {
		//window.addEventListener("hashchange", (event) => {joinUrl();})
		if (chans.length && auth_id !== undefined && !room)
			setLoaded('ok')
	}, [chans])
	
	const joinUrl = () => {
		let url = document.URL;
			let chan:chanType|undefined;
			let index = url.lastIndexOf("#");
			
			if (index === -1) {
				chan = chans.find((c:any) => c.chanUser.find((user:any) => user.auth_id === auth_id));
				if (chan !== undefined)
					joinRoom(chan, false)
			}
			else {
				url = url.substring(url.lastIndexOf("#") + 1);
				chan = chans.find((c:any) => c.id === url);
				if (chan !== undefined)
					joinRoom(chan, false)
				else {
					chan = chans.find((c:any) => c.chanUser.find((user:any) => user.auth_id === auth_id));
					if (chan !== undefined)
						joinRoom(chan, false)
				}
			}
	}

	  const getChan = async () => {
		let channels = await Request('GET', {}, {}, "http://localhost:3000/chan/")
		channels.map((c:any, idx:number) => {
			if (c.id === room)
				c.isActive = true;
			if (c.messages) {
				c.messages.map((m:any, index:number) => {
					c.messages[index] = JSON.parse(String(m));
				})
			}
			channels[idx] = c;
		})
		setChans(channels);
	  }

  const onSubmit = () => {
    if (value !== '' && value.replace(/\s/g, '') !== '' && room !== undefined) {// check if array is empty or contain only whitespace
    	socket.emit('newMessage', {"chat": value, "sender_socket_id": auth_id, "username": username, "avatar": avatar, "room": room});
	}
    setValue('');
  }

  const changeActiveRoom = (id: string) => {
	let tmp:chanType[] = chans;
	tmp.map((chan) => {
		if (chan.id === id)
			chan.isActive = true;
		else
			chan.isActive = false
	})
	setChans(tmp);
  }

  const joinRoom = async (newRoom: chanType, askForJoin: boolean) => {

	let chanToJoin = chans.find((chan:any) => chan.id === newRoom.id)
	if (chanToJoin !== undefined) {
		if (chanToJoin.chanUser.find((u:any) => u.auth_id === auth_id)) {
			setRoom(chanToJoin.id);
			changeActiveRoom(newRoom.id)
			if (newRoom.messages)
				setMessage(newRoom.messages)
  			else
				setMessage([]);
		}
		else {
			if (askForJoin === false || (askForJoin === true && window.confirm("You will join this channel: " + newRoom.name))) {
				socket.emit('joinRoom', newRoom.id, auth_id);
				setRoom(chanToJoin.id);
				changeActiveRoom(chanToJoin.id)
				if (newRoom.messages)
					setMessage(newRoom.messages)
  				else
					setMessage([]);
			}
		}
	}
  }

  const pressEnter = (e:any) => {
    if (e.key === 'Enter')
    	onSubmit();
  }

  const promptAddUser = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove('hidden');
    setModalType("addUser");
    setModalTitle("Add an user");
  }

  const createChan = async () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove('hidden');
    setModalTitle("Create a new channel");
    setModalType("newChan");
  }

  const userInActualchannel = () => {
	let users: Array<any> = [];
	const actualChan = chans.find(c => c.isActive === true);
	if (actualChan?.chanUser)
		actualChan.chanUser.map((u:any) => {
			{users.push(<div key={u.user_id}><UserCards user={u} avatar={false}/></div>)}
		
	})
	return users;
  }

  const chanMemberCount = () => {
	const actualChan = chans.find(c => c.isActive === true);
	if (actualChan?.chanUser)
		return actualChan.chanUser.length
	return 0
  }

	const chanColor = (channel: any) => {
		
		if (channel.id === room)
			return ("bg-primary");
		else if (channel.chanUser.find((u:any) => u.auth_id === auth_id)) //else if (channelJoined.find((chan) => chan.id === channel.id) !== undefined)
			return ("bg-info");
		else
			return ("bg-secondary");
	}

    return (
      <div>
      <div className="tchat row">
        <Modal title={modalTitle} calledBy={modalType}/>
        <div className="channels col-2">
          <button onClick={createChan}>Create Channel</button>
          <div className="channelsList">
            <p>{chans.length} Channels</p>
            {/* <SearchBar /> */}
            {/* DEBUT AFFICHAGE CHAN */}
            <ul className="list-group">
              {chans.map((chan) =>
			  <a key={chan.id} href={"#" + chan.id}>
                <li onClick={() => joinRoom(chan, true)} className={"d-flex flex-row d-flex justify-content-between align-items-center m-2 list-group-item " + (chanColor(chan))}>
                  <div className="">
                    {chan.name}
                  </div>
                </li>
				</a>
              )}
            </ul>
            {/* FIN AFFICHAGE CHAN */}
          </div> {/*fin channelsList*/}
        </div> {/*fin channels*/}
        <div className="tchatMain col-8">
          <div className="tchatMainTitle row">
            <h1 className="col-10">Channel Name</h1>
            <button className="col-2" onClick={promptAddUser}>Add Peoples</button>
          </div>{/*fin tchatMainTitle*/}
          <div id="messages" className="messages row">
          </div>{/*fin messages*/}
          <div className="row">
            <input id="message" ref={msgInput} className="col-10" type="text" placeholder="type your message" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={pressEnter}/>
            <button className="col-1" onClick={onSubmit}>send</button>
          </div>
          <div className="row">
          <div className='messages'>
      <div>
        {messages.length === 0 ? <div>No messages here</div> :
        <div>
          {messages.map((msg, index) =>
            msg.sender_socket_id === auth_id ?
            <div key={index} className="outgoing_msg break-text">
            <div className="sent_msg">
              <p>{msg.content}</p>
            </div>
          </div>:
            <div key={index} className="incoming_msg break-text">
              <div className="incoming_msg_img align-bottom"> <img src={msg.avatar} alt="sunil" /> </div>
              <div className="received_msg">
                <div className="received_withd_msg">
                  <div className="received_withd_msg"><span className="time_date"> {msg.username}</span></div>
                  <p>{msg.content}</p>
                </div>
              </div>
            </div>
          )}
        </div>}
      </div>
    </div>
          </div>
        </div> {/*fin tchatMain*/}
        <div className="tchatMembers col-2">
        	<p> Channnnnel's members ({chanMemberCount()}) </p>
			{userInActualchannel()}
        </div>
      </div>
    </div>
    ); // fin de return
  // <UserCards value={2} avatar={false}/>
}

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


 /*  promptAddUser = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove('hidden');
    this.setState({modalType: "addUser", modalTitle: "Add an user"})
  } */

  /* handleSubmitNewMessage = () => {
      const message = document.getElementById('message') as HTMLInputElement
      console.log("submit " + message.value);
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
      socket.emit('newMessage', {data: message.value });
      this.setState({message: this.state.message + 1})
      message.value = "";

  } */

 /*  createChan = async () => {
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
  } */

  // componentDidMount: any = async () => {
  //   let chans = await Request('GET', {}, {}, "http://localhost:3000/chan/")
	// 		this.setState({chans: chans})
	// }

  render() {
    let users:any = [];
    let x = 0;
    while(x < this.state.userChan.length ) {
      users.push(<UserCards user={this.state.userChan[x]} avatar={true}/>)
      x++;
    }
    let chans:any = []
    x = 0
    while(x < this.state.chans.length) {
      chans.push(<Channels id={this.state.chans[x].name} />)
      x++;
    }
    return (
      <div>
        <WebsocketProvider value={socket}>
          <WebSocket />
        </WebsocketProvider>
      </div>
    ); // fin de return
  } // fin de render
  // <UserCards value={2} avatar={false}/>
} // fin de App

export default Tchat;
