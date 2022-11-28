import { Component, useContext, useEffect, useState, useRef } from "react";
import {Link, useNavigate} from "react-router-dom";
import Modal from "./utils/Modal";
import UserCards from './utils/UserCards'
import Request from "./utils/Requests"
import { socket, WebsocketProvider, WebsocketContext } from '../contexts/WebSocketContext';
import {MessagePayload, ChanType, UserType, PunishSocketType, ErrorType} from "../types"
import { useAuthData } from "../contexts/AuthProviderContext";
import ModalBanUser from './utils/ModalBanUser';
import ModalMuteUser from './utils/ModalMuteUser';

export const WebSocket = () => {
  const [value, setValue] = useState('');
  const [room, setRoom] = useState('');
  const [currentChan, setCurrentChan] = useState<ChanType>();
  const [chans, setChans] = useState<Array<ChanType>>([]);
  const [messages, setMessage] = useState<MessagePayload[]>([]);
  const [modalType, setModalType] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [loaded, setLoaded] = useState("not ok");
  const [chanUser, setChanUser] = useState<Array<UserType>>([]);
  //const [muted, setMuted] = useState({room:{},muted:false});
  //const [banned, setBanned] = useState({room:{},banned:false});
  //const [currentChan, setCurrentChan] = useState<ChanType>();
  //const [userBan, setBanUser] = useState<Array<UserType>>([]);
  const {
    user,
    setError,
    updateBannedFromList,
    updateMutedFromList,
    updateChanFromList,
    updateAllChans,
    mutedFrom,
    bannedFrom
  } = useAuthData();
  const socket = useContext(WebsocketContext);
  const msgInput = useRef<HTMLInputElement>(null)
  const navigate = useNavigate();
  let location = ""

  useEffect(() => {
	// console.log("set !!")
    socket.on('connect', () => { });


    socket.on("userJoinChannel", () => {
      getChan();
    });

    socket.on("chanDeleted", (roomId: string) => {
      chans.forEach((c) => {
        if (c.chanUser.find((u) => u.auth_id === user.auth_id) !== undefined) {
          getChan();
          window.location.href = "http://localhost:8080/chat"; //!
          return ;
        }
      })
    })

    socket.on("userLeaveChannel", () => {
      getChan();
      window.location.replace("http://localhost:8080/chat");
      //navigate("/chat/")
    });

    if (msgInput.current) msgInput.current.focus();

    return () => {
      socket.off('connect');
      socket.off('onMessage');
      socket.off('userJoinChannel');
      /* chans.map((c:ChanType) => {
        if (c.chanUser) {
          c.chanUser.map((u:UserType) => {
            if (u.auth_id === user.auth_id)
              socket.emit('leaveRoom', c.id, user.auth_id);
          })
        }
      }) */
    }
  });

  useEffect(() => {
    socket.on('onMessage', (newMessage: MessagePayload) => {
      let channels: Array<ChanType> = chans;
      let index: number = chans.findIndex((c: ChanType) => c.id === newMessage.room);
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
      return () => {
        socket.off('newChan');
      }
    });
  });

  useEffect(() => {
    if (currentChan && currentChan.messages) {
      setMessage(currentChan.messages);
    }
    else {
      setMessage([]);
    }
  }, [currentChan]);

  useEffect(() => {
    const handleMute = async (obj: PunishSocketType) => {
      if (obj.auth_id === user.auth_id) {
        updateMutedFromList();
      }
    }
    const handleBan = async (obj: PunishSocketType) => {
      if (obj.auth_id === user.auth_id) {
        updateBannedFromList();
      }
    }
    socket.on('mutedChannel', handleMute);
    socket.on('bannedChannel', handleBan);
    return () => {
      socket.off('muteRoom', handleMute);
      socket.off('banRoom', handleBan);
    }
  }, []);


  useEffect(() => {
    const handleError = async (error: ErrorType, auth_id: string) => {
      if (auth_id === user.auth_id) {
        setError(error);
        if (error.statusCode === 450) {
          updateBannedFromList();
          //navigate("/chat/");
        }
        if (error.statusCode === 451) {
          updateMutedFromList();
        }
        if (error.statusCode === 452) {
          updateChanFromList();
        }
      }
    }
    socket.on('error', handleError);
    return () => {
      socket.off('error', handleError);
    }
  }, [])

  useEffect(() => {
    getChan();
  }, [])

  useEffect(() => {
    if (loaded === 'ok')
      joinUrl()
  }, [loaded])

  useEffect(() => {
    let checkUrl = setInterval(() => {
      let url = document.URL
      if (!document.URL.includes("localhost:8080/chat"))
        clearInterval(checkUrl);
      url = url.substring(url.lastIndexOf("/") + 1)
      if (url !== location) {
        location = url
        joinUrl()
      }
    }, 10)
  }, [])

  useEffect(() => {
	if (chans.length && user.auth_id !== undefined)
		setLoaded('ok')
  })

  useEffect(() => {
    let chanUserFind:Array<UserType>|undefined = chans.find((c:ChanType) => c.id === room)?.chanUser
    if (chanUserFind !== undefined) {
      setChanUser(chanUserFind)
    }
  }, [room, chans])

  const createChannel = async (name: string, typep: string, pass: string) => {
    let chans = undefined;
    try {
      chans = await Request(
          'GET',
          {},
          {},
          "http://localhost:3000/chan/"
      )
    } catch (error) {
      setError(error);
    }
    if (!chans) {
      return ;
    }
    const found = chans.find((c:ChanType) => c.name === name)
    if (found) {
      const error = {
        statusCode: 400,
        message: 'Error while creating new chan: Chan name is already taken',
      }
      setError(error);
    }
    let chan = undefined;
    //console.log("pass = ", pass)
    //console.log("type = ", typep)
    try {
      chan = await Request(
          "POST",
          {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          {
            name: name,
            type: typep,
            password: pass,
            owner: user.username,
          },
          "http://localhost:3000/chan/create"
      );
    } catch (error) {
      setError(error);
    }
    if (!chan) {
      return ;
    }
    socket.emit('chanCreated');
    updateAllChans();
    updateChanFromList();
    navigate('/chat/' + chan.id);
    joinUrl();
  };

  const joinUrl = () => {
    let url = document.URL;
    let chan:ChanType|undefined;
    let index = url.lastIndexOf("/");
	chans.forEach((chan) => {
		console.log("try");
		if (chan.chanUser.find((u) => u.auth_id === user.auth_id)) {
			console.log("joinroom : ", chan.name);
			socket.emit("joinRoom", chan.id, user.auth_id);
		}
	})
    if (index === -1) {
      chan = chans.find((c:ChanType) => c.chanUser.find((usr:UserType) => usr.auth_id === user.auth_id));
      if (chan !== undefined) {
        joinRoom(chan)
      }
    }
    else {
      url = url.substring(url.lastIndexOf("/") + 1);
      chan = chans.find((c:ChanType) => c.id === url);
      // console.log("chan", chan)
      if (chan !== undefined) {
        joinRoom(chan)
      }
      else {
        chan = chans.find((c:ChanType) => c.chanUser.find((usr:UserType) => usr.auth_id === user.auth_id));
        if (chan !== undefined) {
          joinRoom(chan)
        }
      }
    }
  }

  const getChan = async () => {
    let channels: ChanType[] = [];
    try {
      channels = await Request(
          'GET',
          {},
          {},
          "http://localhost:3000/chan/")
    } catch (error) {
      setError(error);
    }
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
	console.log("loaded :", loaded)
	console.log(chans.length, user.auth_id, room)
	// chans.length && user.auth_id !== undefined && !room
  }

  const onSubmit = () => {
    if (value !== "" && value.replace(/\s/g, "") !== "" && room !== undefined) {
      // check if array is empty or contain only whitespace
      if (value === "/leave") {
        socket.emit("leaveRoom", { room: room, auth_id: user.auth_id });
        changeActiveRoom("");
        setMessage([]);
        setRoom("null");
        getChan();
        window.location.href = "http://localhost:8080/chat"; //!
      } else {
        socket.emit("newMessage", {
          chat: value,
          sender_socket_id: user.auth_id,
          username: user.username,
          avatar: user.avatar,
          auth_id: user.auth_id,
          room: room,
        });
		}
    }
    setValue("");
  };

  const changeActiveRoom = (id: string) => {
    let tmp: Array<ChanType> = chans;
    tmp.map((chan) => {
      if (chan.id === id) {
        chan.isActive = true;
        setRoom(chan.id);
      }
      else {
        chan.isActive = false;
      }
    });
    setChans(tmp);
  };

  const joinRoom = async (newRoom: ChanType) => {

    let chanToJoin = chans.find((chan: ChanType) => chan.id === newRoom.id)
    if (chanToJoin !== undefined) {
      if (chanToJoin.chanUser.find((u: UserType) => u.auth_id === user.auth_id)) {
        setCurrentChan(chanToJoin);
        setRoom(chanToJoin.id);
        changeActiveRoom(chanToJoin.id);
        setChanUser(chanToJoin.chanUser);
      } else {
        socket.emit("joinRoom", newRoom.id, user.auth_id);
		//console.log("join room : ", user.auth_id, " newroom ", newRoom)
        setRoom(chanToJoin.id);
        changeActiveRoom(chanToJoin.id);
        setCurrentChan(chanToJoin);
      }
    }
  };

  const pressEnter = (e: any) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const promptAddUser = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove("hidden");
    setModalType("addUser");
    setModalTitle("Add a user");
  };

  const createChan = async () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove("hidden");
    setModalTitle("Create a new channel");
    setModalType("newChan");
  };

  const joinChan = async () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove("hidden");
    setModalTitle("Join a channel");
    setModalType("joinChan");
  };

  const arrayUserInActualchannel = () => {
    let users: Array<UserType> = [];
    const actualChan = chans.find((c: ChanType) => c.isActive);
    if (actualChan?.chanUser) {
      users = actualChan.chanUser;
    }
    return users;
  };

  const chanColor = (channel: ChanType) => {

    if (channel.id === room)
      return ("bg-primary");
    // else
    //   return ("bg-info");
  }

  const printName = (chan: ChanType) => {
    if (chan && chan.type === "direct") {
      if (user.username === chan.chanUser[0].username) {
        return chan.chanUser[1].username;
      }
      else {
        return chan.chanUser[0].username;
      }
    }
    else {
      return chan.name;
    }
  };

  const inChan = (chan: ChanType) => {
    if (chan.chanUser.find((u: UserType) => u.auth_id === user.auth_id))
      return 1
    return 0
  }

  const listChansJoined = (chan: Array<ChanType>) => {
    let ret: any[] = [];
    for (let x = 0; x < chans.length; x++)
      if (chan[x].chanUser.find((u: UserType) => u.auth_id === user.auth_id)) {
        ret.push(chan[x]);
      }
    return ret;
  };

  const chansJoined = (chan: Array<ChanType>) => {
    let count = 0;
    for (let x = 0; x < chans.length; x++)
      if (chan[x].chanUser.find((u: UserType) => u.auth_id === user.auth_id)) {
        count++;
      }
    return count;
  }

  // ======================== RENDER ==========================

  class UsersInActualchannel extends Component<{}, {}> {
    render() {
      let users: any = [];
      const actualChan = chanUser;
      if (actualChan.length)
        actualChan.map((u: UserType) => {
          users.push(<div key={u.user_id}><UserCards user={u} avatar={false} stat={false} /></div>)
        })
      return users;
    }
  }

  class DispatchMsg extends Component<{}, {}> {
    render() {
      let ret: any[] = []
      messages.map((msg: MessagePayload, index: number) => {
        if (msg.sender_socket_id === user.auth_id)
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
                <div className="incoming_msg_img align-bottom"> <img src={"http://localhost:3000/user/" + msg.auth_id + "/avatar"} alt="ImageNotFound" /> </div>
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
  }


  class PrintMessages extends Component<{}, {}>{
    render() {
      if (messages.length === 0) {
        return (<div>No messages here</div>)
      } else {
        return (
            <div className='messages'>
              <DispatchMsg />
            </div>
        )
      }
    }
  }

  class AdminButtons extends Component<{}, {}> {
    render() {
      let chan = chans[chans.findIndex((c: ChanType) => c.id === room)]
      let tab: any[] = chan.admin
      // console.log(tab)
      if ((tab && tab.findIndex((u: any) => u === user.username) > -1) || chan.owner === user.username) {
        return (
            <div className="row">
              <ModalBanUser chan={room} socket={socket}/>
              <ModalMuteUser chan={room} socket={socket} />
            </div>
        )
      }
    }
  }

  class PrintAddUserButton extends Component<{}, {}> {
    render() {
      let url: string = document.URL
      url = url.substring(url.lastIndexOf("/") + 1);
      let id = parseInt(url)
      if (id && id > 0 && chans[id - 1] && !(chans[id - 1].type === "direct")) {
        return (<button id="addPeople" className="col-2" onClick={promptAddUser}>Add Peoples</button>)
      }
    }
  }

  class PrintHeaderChan extends Component<{}, {}> {
    render() {
      return (
          <div className="chatMainTitle row">
            <h1 className="col-10">Channel Name</h1>
            <PrintAddUserButton />
            <AdminButtons />
          </div>
      )
    }
  }

  class PrintChannel extends Component<{}, {}> {
    render() {
      if (room) {
        return (
            <div className="inChat row col-10">
              <div className="chatMain col-10">
                <PrintHeaderChan />
                <div className="row">
                  <div>
                  <PrintMessages/>
                  <div className="row">
                    <div>
                    <input id="message" ref={msgInput} className="col-10" type="text" placeholder="type your message" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={pressEnter} />
                    <button className="col-1" onClick={onSubmit}>send</button>
                    </div>
                  </div>
                  </div>
                </div>
              </div> {/*fin chatMain*/}
              <div className="chatMembers col-2">
                <p> Channel's members ({chanUser.length}) </p>
                <UsersInActualchannel />
              </div>
            </div>
        )
      }
    }
  }

  class ListOfPrivateMessages extends Component<{}, {}>{
    render() {
      let ret: any[] = []
      chans.map((chan) => {
            if (chan.type === "direct")
              ret.push(
                  <Link key={chan.id} to={"/chat/" + chan.id}>
                    <li onClick={() => joinRoom(chan)} className={"d-flex flex-row d-flex justify-content-between align-items-center m-2 list-group-item " + (chanColor(chan))}>
                      {printName(chan)}
                    </li>
                  </Link>
              )
          }
      )
      return ret
    }
  }

  class ListOfJoinedChans extends Component<{}, {}> {
    render() {
      let ret: any[] = []
      chans.map((chan: ChanType) => {
            if (chan.type !== "direct" && inChan(chan))
              ret.push(
                  <Link key={chan.id} to={"/chat/" + chan.id}>
                    <li onClick={() => joinRoom(chan)} className={"d-flex flex-row d-flex justify-content-between align-items-center m-2 list-group-item " + (chanColor(chan))}>
                      {printName(chan)}
                    </li>
                  </Link>
              )
          }
      )
      return ret
    }
  }

  class ChannelList extends Component<{}, {}> {
    render() {
      return (
        <div className="channels col-2">
          <button className="btn btn-outline-dark shadow-none" onClick={createChan}>Create Channel</button>
          <button className="btn btn-outline-dark shadow-none" onClick={joinChan}>Join Channel</button>
          <div className="channelsList">
            <p>{chansJoined(chans)} Channels</p>
            <div className="list-group">
              <ul>
                <ListOfJoinedChans />
              </ul>
              <ul>
                <ListOfPrivateMessages />
              </ul>
            </div>
            </div>
          </div>
      )
    }
  }

  return (
      <div>
        <div className="chat row">
          <h4>CHAT</h4>
          <Modal title={modalTitle} calledBy={modalType} /* userBan={userBan} */ userChan={arrayUserInActualchannel()} parentCallBack={{"socket": socket, "room": room, joinRoom, createChannel}} chans={listChansJoined(chans)}/>
          <ChannelList />
          <PrintChannel />
        </div>
      </div>
  ); // fin de return
};

class Chat extends Component<{}, {}> {
  render() {
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

export default Chat;
