import { Component, useContext, useEffect, useState, useRef } from "react";
import {Link, useNavigate} from "react-router-dom";
import Modal from "../utils/Modal";
import UserCards from '../utils/UserCards'
import Request from "../utils/Requests"
import { socket, WebsocketProvider, WebsocketContext } from '../../contexts/WebSocketContext';
import {MessagePayload, ChanType, UserType, PunishSocketType, ErrorType} from "../../types"
import { useAuthData } from "../../contexts/AuthProviderContext";
import ModalBanUser from '../utils/ModalBanUser';
import ModalMuteUser from '../utils/ModalMuteUser';
import { ChannelList } from './ChannelList'
import { PrintChannel } from './PrintChannel'

export const WebSocket = () => {
  const [value, setValue] = useState('');
  const [room, setRoom] = useState('');
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


// ================= UseEffects ===================

  useEffect(() => {
    socket.on('connect', () => { });
    socket.on('onMessage', (newMessage: MessagePayload) => {
      let channels: Array<ChanType> = chans;
      let index: number = chans.findIndex((c: ChanType) => c.id === newMessage.room);
      if (channels[index] !== undefined)
      {
        if (channels[index].messages)
          channels[index].messages = [...channels[index].messages, newMessage];
        else
          channels[index].messages = [newMessage];
        setChans(channels);
        if (channels[index].isActive)
        {
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
      // window.location.replace("http://localhost:8080/chat");
      navigate("/chat/")
    });
    if (msgInput.current)
      msgInput.current.focus();
    if (chans.length && user.auth_id !== undefined)
  		setLoaded('ok')
    return () => {
      socket.off('connect');
      socket.off('onMessage');
      socket.off('newChan');
      socket.off('userJoinChannel');
    }
  });

  useEffect(() => {
    const handleMute = async (obj: PunishSocketType) => {
      if (obj.auth_id === user.auth_id)
        updateMutedFromList()
    }
    const handleBan = async (obj: PunishSocketType) => {
      if (obj.auth_id === user.auth_id)
        updateBannedFromList();
    }
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
    getChan();
    socket.on('mutedChannel', handleMute);
    socket.on('bannedChannel', handleBan);
    socket.on('error', handleError);
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
    return () => {
      socket.off('error', handleError);
      socket.off('muteRoom', handleMute);
      socket.off('banRoom', handleBan);
    }
  }, []);

  useEffect(() => {
    if (loaded === 'ok')
      joinUrl()
  }, [loaded])

  useEffect(() => {
    let chanUserFind:Array<UserType>|undefined = chans.find((c:ChanType) => c.id === room)?.chanUser
    if (chanUserFind !== undefined) {
      setChanUser(chanUserFind)
    }
  }, [room, chans])

// ================= Fin UseEffects ===================

  const createChannel = async (name: string, typep: string, pass: string) => {
    let chans:Array<ChanType>;
    let chanCreated:ChanType;
    try {
      chans = await Request(
          'GET',
          {},
          {},
          "http://localhost:3000/chan/"
      )
      const found = chans.find((c:ChanType) => c.name === name)
      if (found) {
        const error = {
          statusCode: 400,
          message: 'Error while creating new chan: Chan name is already taken',
        }
        setError(error);
        return;
      }
      try {
        chanCreated = await Request(
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
        socket.emit('chanCreated');
        updateAllChans();
        updateChanFromList();
        navigate('/chat/' + chanCreated.id);
        joinUrl();
      } catch (error) {
        setError(error);
      }
    } catch (error) {
      setError(error);
    }
  };



  const joinUrl = () => {
    let url = document.URL;
    let chan:ChanType|undefined;
    let index = url.lastIndexOf("/");
  	chans.forEach((chan) => {
  		if (chan.chanUser.find((u) => u.auth_id === user.auth_id)) {
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
    } catch (error) {
      setError(error);
    }
  }

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
        setRoom(chanToJoin.id);
        changeActiveRoom(newRoom.id);
        setChanUser(newRoom.chanUser);
        if (newRoom.messages) {
          setMessage(newRoom.messages);
        }
        else {
          setMessage([]);
        }
      } else {
        socket.emit("joinRoom", newRoom.id, user.auth_id);
        setRoom(chanToJoin.id);
        changeActiveRoom(chanToJoin.id);
        if (newRoom.messages) {
          setMessage(newRoom.messages);
        }
        else {
          setMessage([]);
        }
      }
    }
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

  const listChansJoined = (chan: Array<ChanType>) => {
    let ret: any[] = [];
    for (let x = 0; x < chans.length; x++)
      if (chan[x].chanUser.find((u: UserType) => u.auth_id === user.auth_id))
        ret.push(chan[x]);
    return ret;
  };


  // ======================== RENDER ==========================

  return (
      <div>
        <div className="chat row">
          <h4>CHAT</h4>
          <Modal title={modalTitle} calledBy={modalType} /* userBan={userBan} */ userChan={arrayUserInActualchannel()} parentCallBack={{"socket": socket, "room": room, joinRoom, createChannel}} chans={listChansJoined(chans)}/>
          <ChannelList
            chanList={chans}
            room={room}
            user={user}
            parentCallBack={{createChan, joinChan, joinRoom}}
            />
            <PrintChannel
              msgInput={msgInput}
              value={value}
              chans={chans}
              user={user}
              room={room}
              usersInChan={chanUser}
              messages={messages}
              parentCallBack={{setModalType, setModalTitle, setValue, getChan}}
               />
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
} // fin de App

export default Chat;
