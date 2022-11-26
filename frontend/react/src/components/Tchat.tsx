import { Component, useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Modal from "./utils/Modal";
import UserCards from './utils/UserCards'
import Request from "./utils/Requests"
import { socket, WebsocketProvider, WebsocketContext } from '../contexts/WebSocketContext';
import { MessagePayload, ChanType, UserType } from "../types"
import { useAuthData } from "../contexts/AuthProviderContext";
import ModalBanUser from './utils/ModalBanUser';
import ModalMuteUser from './utils/ModalMuteUser';

export const WebSocket = () => {
  const [value, setValue] = useState('');
  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [auth_id, setAuthId] = useState('');
  const [room, setRoom] = useState('');
  const [chans, setChans] = useState<Array<ChanType>>([]);
  const [messages, setMessage] = useState<MessagePayload[]>([]);
  const [modalType, setModalType] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [loaded, setLoaded] = useState("");
  const [chanUser, setChanUser] = useState<Array<UserType>>([]);
  //const [userBan, setBanUser] = useState<Array<UserType>>([]);
  const { user, setError } = useAuthData();
  const socket = useContext(WebsocketContext);
  const msgInput = useRef<HTMLInputElement>(null)
  let location = ""

  useEffect(() => {
    socket.on('connect', () => { });
    socket.on('onMessage', (newMessage: MessagePayload) => {
      // console.log("RECEIVE ////////////////")
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
    });

    socket.on("userJoinChannel", () => {
      getChan();
    });

    socket.on("userLeaveChannel", () => {
      getChan();
      window.location.replace("http://localhost:8080/tchat");
    });

    if (msgInput.current) msgInput.current.focus();

    return () => {
      socket.off('connect');
      socket.off('onMessage');
      socket.off('newChan');
      socket.off('userJoinChannel');
      chans.map((c: ChanType) => {
        if (c.chanUser) {
          c.chanUser.map((u: UserType) => {
            if (u.auth_id === auth_id)
              socket.emit('leaveRoom', c.id, auth_id);
          })
        }
      })
    }
  });

  useEffect(() => {
    let data: any = sessionStorage.getItem('data');
    let parseData = JSON.parse(data);
    let newUser: UserType = parseData.user
    getChan();
    setAvatar(newUser.avatar);
    setUsername(newUser.username);
    setAuthId(newUser.auth_id);
  }, [])

  useEffect(() => {
    if (loaded === 'ok')
      joinUrl()
  }, [loaded])

  useEffect(() => {
    let checkUrl = setInterval(() => {
      let url = document.URL
      if (!document.URL.includes("localhost:8080/tchat"))
        clearInterval(checkUrl);
      url = url.substring(url.lastIndexOf("/") + 1)
      if (url !== location) {
        location = url
        joinUrl()
      }
    }, 10)
    if (chans.length && auth_id !== undefined && !room)
      setLoaded('ok')
  }, [chans])

  useEffect(() => {
    let chanUserFind: Array<UserType> | undefined = chans.find((c: ChanType) => c.id === room)?.chanUser
    if (chanUserFind !== undefined) {
      setChanUser(chanUserFind)
    }
  }, [room, chans])




  const createChannel = async () => {
    const name = document.querySelector("#chanName") as HTMLInputElement;
    const password = document.querySelector("#chanPassword") as HTMLInputElement;
    const radioPub = document.querySelector("#public") as HTMLInputElement;
    const radioPri = document.querySelector("#private") as HTMLInputElement;
    const radioPro = document.querySelector("#protected") as HTMLInputElement;
    let radioCheck = "";
    let pswd = "";
    if (radioPub.checked === true)
      radioCheck = "public";
    else if (radioPri.checked === true)
      radioCheck = "private";
    else if (radioPro.checked === true)
      radioCheck = "protected";
    try {
      let chans = await Request('GET', {}, {}, "http://localhost:3000/chan/")
      chans = chans.find((c: ChanType) => c.name === name.value)
      if (radioCheck !== "" && name.value && chans === undefined) {
        if (password.value)
          pswd = password.value;
        await Request(
          "POST",
          {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          {
            name: name.value,
            type: radioCheck,
            password: pswd,
            owner: username
          },
          "http://localhost:3000/chan/create"
        );
        let chan = await Request('GET', {}, {}, ("http://localhost:3000/chan/" + name.value))
        name.value = "";
        password.value = "";
        radioPub.checked = false;
        radioPri.checked = false;
        radioPro.checked = false;
        socket.emit('chanCreated');
        window.location.replace('http://localhost:8080/tchat/' + chan.id)
        // window.location.reload();
      }
    } catch (error) {
      setError(error);
    }
  };

  const joinUrl = () => {
    let url = document.URL;
    let chan: ChanType | undefined;
    let index = url.lastIndexOf("/");

    if (index === -1) {
      chan = chans.find((c: ChanType) => c.chanUser.find((user: UserType) => user.auth_id === auth_id));
      if (chan !== undefined)
        joinRoom(chan)
    }
    else {
      url = url.substring(url.lastIndexOf("/") + 1);
      chan = chans.find((c: ChanType) => c.id === url);
      // console.log("chan", chan)
      if (chan !== undefined)
        joinRoom(chan)
      else {
        chan = chans.find((c: ChanType) => c.chanUser.find((user: UserType) => user.auth_id === auth_id));
        if (chan !== undefined)
          joinRoom(chan)
      }
    }
  }

  const getChan = async () => {
    try {
      let channels = await Request('GET', {}, {}, "http://localhost:3000/chan/")
      channels.map((c: ChanType, idx: number) => {
        if (c.id === room)
          c.isActive = true;
        if (c.messages) {
          c.messages.map((m: any, index: number) => {
            c.messages[index] = JSON.parse(String(m));
          })
        }
        channels[idx] = c;
      })
      setChans(channels);
    } catch (error) {
      setError(error);
    }
  }

  const onSubmit = () => {
    if (value !== "" && value.replace(/\s/g, "") !== "" && room !== undefined) {
      // check if array is empty or contain only whitespace
      if (value === "/leave") {
        socket.emit("leaveRoom", { room: room, auth_id: auth_id });
        changeActiveRoom("");
        setMessage([]);
      } else
        socket.emit("newMessage", {
          chat: value,
          sender_socket_id: auth_id,
          username: username,
          avatar: avatar,
          room: room,
        });
    }
    setValue("");
  };

  const changeActiveRoom = (id: string) => {
    let tmp: Array<ChanType> = chans;
    tmp.map((chan) => {
      if (chan.id === id) chan.isActive = true;
      else chan.isActive = false;
    });
    setChans(tmp);
  };

  const joinRoom = async (newRoom: ChanType) => {

    let chanToJoin = chans.find((chan: ChanType) => chan.id === newRoom.id)
    if (chanToJoin !== undefined) {
      if (chanToJoin.chanUser.find((u) => u.auth_id === auth_id)) {
        setRoom(chanToJoin.id);
        changeActiveRoom(newRoom.id);
        setChanUser(newRoom.chanUser);
        if (newRoom.messages) setMessage(newRoom.messages);
        else setMessage([]);
      } else {
        // if (
        //   askForJoin === false ||
        //   (askForJoin === true &&
        //     window.confirm("You will join this channel: " + newRoom.name))
        // )
        {
          socket.emit("joinRoom", newRoom.id, auth_id);
          setRoom(chanToJoin.id);
          changeActiveRoom(chanToJoin.id);
          if (newRoom.messages) setMessage(newRoom.messages);
          else setMessage([]);
        }
      }
    }
  };

  const pressEnter = (e: any) => {
    if (e.key === "Enter") onSubmit();
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

  /*
  const toBanUser = async () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove('hidden');
    setModalTitle("Ban Users");
    setModalType("banUser");
  }


  */

  const arrayUserInActualchannel = () => {
    let users: Array<UserType> = [];
    const actualChan = chans.find((c) => c.isActive === true);
    if (actualChan?.chanUser) users = actualChan.chanUser;
    return users;
  };

  /*
  const fetchBanned = async () => {
    const actualChan: ChanType | undefined = chans.find((c) => c.isActive);
    if (!actualChan) {
      return ;
    }
    let res = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/chan/" + actualChan.id + "/banned",
    )
    setBanUser(res);
    console.log('res banned users = ', res);
  }
   */

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
    if (chan.chanUser.find((u: UserType) => u.auth_id === auth_id))
      return 1
    return 0
  }

  const listChansJoined = (chan: Array<ChanType>) => {
    let ret: any[] = [];
    for (let x = 0; x < chans.length; x++)
      if (chan[x].chanUser.find((u: UserType) => u.auth_id === auth_id))
        ret.push(chan[x]);
    return ret;
  };


  const chansJoined = (chan: Array<ChanType>) => {
    let count = 0;
    for (let x = 0; x < chans.length; x++)
      if (chan[x].chanUser.find((u: UserType) => u.auth_id === auth_id))
        count++;
    return count;
  }


  // ======================== RENDER ==========================

  class UsersInActualchannel extends Component<{}, {}> {
    render() {
      let users: any = [];
      const actualChan = chanUser;
      if (actualChan.length)
        actualChan.map((u: UserType) => {
          { users.push(<div key={u.user_id}><UserCards user={u} avatar={false} stat={false} /></div>) }
        })
      return users;
    }
  }

  class DispatchMsg extends Component<{}, {}> {
    render() {
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
  }


  class PrintMessages extends Component<{}, {}>{
    render() {
      if (messages.length === 0)
        return (<div>No messages here</div>)
      return (
        <div className='messages'>
          <DispatchMsg />
        </div>
      )
    }
  }

  class AdminButtons extends Component<{}, {}> {
    render() {
      let chan = chans[chans.findIndex((c: ChanType) => c.id === room)]
      let tab: any[] = chan.admin
      console.log(tab)
      if ((tab && tab.findIndex((u: any) => u === user.username) > -1) || chan.owner === user.username) {
        return (
          <div className="row">
            <ModalBanUser chan={room} socket={socket} />
            <ModalMuteUser chan={room} socket={socket} />
          </div>
        )
      }
    }
  }

  //<button className="col-6" onClick={toBanUser}>BAN</button>
  //<button className="col-6" onClick={muteUser}>MUTE</button>

  class PrintAddUserButton extends Component<{}, {}> {
    render() {
      let url: string = document.URL
      url = url.substring(url.lastIndexOf("/") + 1);
      let id = parseInt(url)
      if (id && id > 0 && chans[id - 1] && !(chans[id - 1].type === "direct"))
        return (<button id="addPeople" className="col-2" onClick={promptAddUser}>Add Peoples</button>)

    }
  }

  class PrintHeaderChan extends Component<{}, {}> {
    render() {
      return (
        <div className="tchatMainTitle row">
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
          <div className="inTchat row col-10">
            <div className="tchatMain col-10">
              <PrintHeaderChan />
              <div className="row">
                <PrintMessages />
                <div className="row">
                  <input id="message" ref={msgInput} className="col-10" type="text" placeholder="type your message" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={pressEnter} />
                  <button className="col-1" onClick={onSubmit}>send</button>
                </div>
              </div>
            </div> {/*fin tchatMain*/}
            <div className="tchatMembers col-2">
              <p> Channnnnel's members ({chanUser.length}) </p>
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
            <Link key={chan.id} to={"/tchat/" + chan.id}>
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
      chans.map((chan) => {
        if (chan.type !== "direct" && inChan(chan))
          ret.push(
            <Link key={chan.id} to={"/tchat/" + chan.id}>
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
          <button onClick={createChan}>Create Channel</button>
          <button onClick={joinChan}>Join Channel</button>
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
      <div className="tchat row">
        <h4>CHAT</h4>
        <Modal title={modalTitle} calledBy={modalType} /* userBan={userBan} */ userChan={arrayUserInActualchannel()} parentCallBack={{ "socket": socket, "room": room, joinRoom, createChannel }} chans={listChansJoined(chans)} />
        <ChannelList />
        <PrintChannel />
      </div>
    </div>
  ); // fin de return
};

class Tchat extends Component<{}, {}> {
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

export default Tchat;
