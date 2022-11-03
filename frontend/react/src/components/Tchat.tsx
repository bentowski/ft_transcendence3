import { Component, useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom'
import Modal from "./utils/Modal";
import UserCards from './utils/UserCards'
import Request from "./utils/Requests"
import { socket, WebsocketProvider, WebsocketContext } from '../contexts/WebSocketContext';
import { MessagePayload, ChanType } from "../types"



class Channels extends Component<{ id: number }, { name: string }> {
  constructor(props: any) {
    super(props)
    this.state = { name: "" }
  }

  componentDidMount = async () => {
    let chan = await Request('GET', {}, {}, "http://localhost:3000/chan/" + this.props.id)
    this.setState({ name: chan.name })
  }

  render() {
    return (
      <div key={this.props.id} className="d-flex flex-row d-flex justify-content-between align-items-center m-2">
        <div className="">
          <a href="/tchat">{this.state.name}</a>
        </div>
      </div>
    ) // fin de return
  } // fin de render
} // fin de Channels



export const WebSocket = () => {
  const [value, setValue] = useState('');
  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [auth_id, setAuthId] = useState('');
  const [room, setRoom] = useState('');
  const [chans, setChans] = useState<ChanType[]>([]);
  const [messages, setMessage] = useState<MessagePayload[]>([]);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [loaded, setLoaded] = useState('');
  const [chanUser, setChanUser] = useState<any[]>([])

  const socket = useContext(WebsocketContext);
  const msgInput = useRef<HTMLInputElement>(null)
  let location = ""

  useEffect(() => {
    socket.on('connect', () => {
    });
    socket.on('onMessage', (newMessage: MessagePayload) => {
		let channels:ChanType[] = chans;
		let index:number = chans.findIndex((c:ChanType) => c.id === newMessage.room);
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
	  chans.map((c:ChanType) => {
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
    let test = setInterval(() => {
      let url = document.URL
      if (!document.URL.includes("localhost:8080/profil"))
        clearInterval(test);
      url = url.substring(url.lastIndexOf("/") + 1)
      if (url !== location) {
        joinUrl()
      }
    }, 10)
		if (chans.length && auth_id !== undefined && !room)
			setLoaded('ok')
	}, [chans])

	useEffect(() => {
		let chanUserFind:any[]|undefined = chans.find((c:ChanType) => c.id === room)?.chanUser
		if (chanUserFind !== undefined)
			setChanUser(chanUserFind)
	}, [room, chans])

	const joinUrl = () => {
		let url = document.URL;
			let chan:ChanType|undefined;
			let index = url.lastIndexOf("/");

			if (index === -1) {
				chan = chans.find((c:ChanType) => c.chanUser.find((user:any) => user.auth_id === auth_id));
				if (chan !== undefined)
					joinRoom(chan, false)
			}
			else {
				url = url.substring(url.lastIndexOf("/") + 1);
				chan = chans.find((c:ChanType) => c.id === url);
        console.log("chan", chan)
				if (chan !== undefined)
					joinRoom(chan, false)
				else {
					chan = chans.find((c:ChanType) => c.chanUser.find((user:any) => user.auth_id === auth_id));
					if (chan !== undefined)
						joinRoom(chan, false)
				}
			}
	}

	  const getChan = async () => {
		let channels = await Request('GET', {}, {}, "http://localhost:3000/chan/")
		channels.map((c:ChanType, idx:number) => {
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
      socket.emit('newMessage', { "chat": value, "sender_socket_id": auth_id, "username": username, "avatar": avatar, "room": room });
    }
    setValue('');
  }

  const changeActiveRoom = (id: string) => {
    let tmp: ChanType[] = chans;
    tmp.map((chan) => {
      if (chan.id === id)
        chan.isActive = true;
      else
        chan.isActive = false
    })
    setChans(tmp);
  }

  const joinRoom = async (newRoom: ChanType, askForJoin: boolean) => {

    let chanToJoin = chans.find((chan: ChanType) => chan.id === newRoom.id)
    if (chanToJoin !== undefined) {
      if (chanToJoin.chanUser.find((u) => u.auth_id === auth_id)) {
        setRoom(chanToJoin.id);
        changeActiveRoom(newRoom.id)
        setChanUser(newRoom.chanUser)
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

  const pressEnter = (e: any) => {
    if (e.key === 'Enter')
      onSubmit();
  }

  const promptAddUser = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove('hidden');
    setModalType("addUser");
    setModalTitle("Add a user");
  }

  const createChan = async () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove('hidden');
    setModalTitle("Create a new channel");
    setModalType("newChan");
  }

  const joinChan = async () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove('hidden');
    setModalTitle("Join a channel");
    setModalType("joinChan");
  }

  const banUser = async () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove('hidden');
    setModalTitle("Ban Users");
    setModalType("banUser");
  }

  const muteUser = async () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove('hidden');
    setModalTitle("Mute Users");
    setModalType("muteUser");
  }

  const arrayUserInActualchannel = () => {
	let users: Array<any> = [];
	const actualChan = chans.find(c => c.isActive === true);
	if (actualChan?.chanUser)
		users = actualChan.chanUser
	return users;
  }

  const userInActualchannel = () => {
	let users: Array<any> = [];
	const actualChan = chanUser;//chans.find(c => c.isActive === true);
	if (actualChan.length)
		actualChan.map((u:any) => {
			{users.push(<div key={u.user_id}><UserCards user={u} avatar={false} stat={false} /></div>)}
	})
	return users;
  }

  const chanColor = (channel: ChanType) => {

    if (channel.id === room)
      return ("bg-primary");
    else
      return ("bg-info");
  }

  const printName = (chan: ChanType) => {
    if (chan.type === "direct") {
      let currentUser: any = sessionStorage.getItem("data");
      currentUser = JSON.parse(currentUser);
      if (currentUser.user.username === chan.chanUser[0].username)
        return (chan.chanUser[1].username);
      else
        return (chan.chanUser[0].username);
    }
    else
      return (chan.name);
  }

  const printAddUserButton = (chans: ChanType[]) => {
    let url: string = document.URL
    url = url.substring(url.lastIndexOf("/") + 1);
    let id = parseInt(url)
    if (id && id > 0 && chans[id - 1] && !(chans[id - 1].type === "direct"))
      return (<button id="addPeople" className="col-2" onClick={promptAddUser}>Add Peoples</button>)
  }

  const inChan = (chan: ChanType) => {
    if (chan.chanUser.find((u: any) => u.auth_id === auth_id))
      return 1
    return 0
  }

  const chansJoined = (chan: ChanType[]) => {
    let count = 0;
    for (let x = 0; x < chans.length; x++)
      if (chan[x].chanUser.find((u: any) => u.auth_id === auth_id))
        count++;
    return count;
  }

  const listChansJoined = (chan: ChanType[]) => {
    let ret: any[] = [];
    for (let x = 0; x < chans.length; x++)
      if (chan[x].chanUser.find((u: any) => u.auth_id === auth_id))
        ret.push(chan[x]);
    return ret;
  }

  const adminButtons = () => {
    return (
      <div className="row">
        <button className="col-6" onClick={banUser}>BAN</button>
        <button className="col-6" onClick={muteUser}>MUTE</button>
      </div>
    )
  }

  const channelList = () => {
    return (
      <div className="channels col-2">
      <button onClick={createChan}>Create Channel</button>
        <button onClick={joinChan}>Join Channel</button>
        <div className="channelsList">
          <p>{chansJoined(chans)} Channels</p>
          {/* <SearchBar /> */}
          {/* DEBUT AFFICHAGE CHAN */}
          <div className="list-group">
            <ul>
              {chans.map((chan) =>
                chan.type !== "direct" && inChan(chan)  ?
                <Link key={chan.id} to={"/tchat/" + chan.id}>
                  <li onClick={() => joinRoom(chan, true)} className={"d-flex flex-row d-flex justify-content-between align-items-center m-2 list-group-item " + (chanColor(chan))}>
                    <div className="">
                      {printName(chan)}
                    </div>
                  </li>
                </Link> :
                <div key={chan.id}></div>
              )}
            </ul>
            <ul>
              {chans.map((chan) =>
                chan.type === "direct" ?
                <Link key={chan.id} to={"/tchat/" + chan.id}>
                  <li onClick={() => joinRoom(chan, true)} className={"d-flex flex-row d-flex justify-content-between align-items-center m-2 list-group-item " + (chanColor(chan))}>
                    <div className="">
                      {printName(chan)}
                    </div>
                  </li>
                </Link> :
                <div key={chan.id}></div>
              )}
            </ul>
          </div>
          {/* FIN AFFICHAGE CHAN */}
        </div> {/*fin channelsList*/}
      </div>
    )
  }

  const printHeaderChan = () => {
    return (
      <div className="tchatMainTitle row">
        <h1 className="col-10">Channel Name</h1>
        {printAddUserButton(chans)}
      </div>
    )
  }

  const test2 = () => {
    let ret: any[] = []
    messages.map((msg, index) => {
      if (msg.sender_socket_id === auth_id)
        ret.push(
          <div key={index} className="outgoing_msg break-text">
            <div className="sent_msg">
              <p>{msg.content}</p>
            </div>
          </div>
        )
      else
        ret.push(
          <div key={index} className="incoming_msg break-text">
            <div className="incoming_msg_img align-bottom"> <img src={msg.avatar} alt="sunil" /> </div>
            <div className="received_msg">
              <div className="received_withd_msg">
                <div className="received_withd_msg"><span className="time_date"> {msg.username}</span></div>
                <p>{msg.content}</p>
              </div>
            </div>
          </div>
        )
    })
    return ret
  }

  const printMessages = () => {
    if (messages.length === 0)
      return (<div>No messages here</div>)
    return (
      <div className='messages'>
        {test2()}
      </div>
    )
  }

  const printChannel = () => {
    return (
      <div className="inTchat row col-10">
        <div className="tchatMain col-10">
          {printHeaderChan()}
          {adminButtons()}
          <div className="row">
            {printMessages()}
            <div className="row">
              <input id="message" ref={msgInput} className="col-10" type="text" placeholder="type your message" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={pressEnter} />
              <button className="col-1" onClick={onSubmit}>send</button>
            </div>
          </div>
        </div> {/*fin tchatMain*/}
        <div className="tchatMembers col-2">
          <p> Channnnnel's members ({chanUser.length}) </p>
          {userInActualchannel()}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="tchat row">
        <Modal title={modalTitle} calledBy={modalType} userChan={arrayUserInActualchannel()} parentCallBack={{"socket": socket, "room": room, joinRoom}} chans={listChansJoined(chans)}/>
        {channelList()}
        {printChannel()}
      </div>
    </div>
  ); // fin de return
}

class Tchat extends Component<{}, { message: number, chans: ChanType[], userChan: any, modalType: string, modalTitle: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      message: 0,
      modalType: "",
      modalTitle: "",
      chans: [],
      userChan: []
    }
  }

  render() {
    let users: any = [];
    let x = 0;
    while (x < this.state.userChan.length) {
      users.push(<UserCards user={this.state.userChan[x]} avatar={true} stat={false} />)
      x++;
    }
    let chans: any[] = []
    x = 0
    while (x < this.state.chans.length) {
      chans.push(<Channels id={parseInt(this.state.chans[x].id)} />)
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
