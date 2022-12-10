import { Component, useContext, useEffect, useState, useRef } from "react";
import { useNavigate} from "react-router-dom";
import Modal from "../utils/Modal";
import Request from "../utils/Requests"
import { socket, WebsocketProvider, WebsocketContext } from '../../contexts/WebSocketContext';
import { ChanType, UserType, PunishSocketType, ErrorType } from "../../types"
import { useAuthData } from "../../contexts/AuthProviderContext";
import { ChannelList } from './ChannelList'
import { PrintChannel } from './PrintChannel'

export const WebSocket = (): JSX.Element => {
  const [value, setValue] = useState('');
  const [room, setRoom] = useState('');
  const [currentChan, setCurrentChan] = useState<ChanType>();
  const [chanList, setChanList] = useState<Array<ChanType>>([]);
  const [modalType, setModalType] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [loaded, setLoaded] = useState("not ok");
  const [chanUser, setChanUser] = useState<Array<UserType>>([]);
  const [url, setUrl] = useState<string>('');
  const {
    user,
    setError,
    updateBannedFromList,
    updateMutedFromList,
    updateChanFromList,
    updateAdminFromList,
  } = useAuthData();
  const socket = useContext(WebsocketContext);
  const msgInput = useRef<HTMLInputElement>(null)
  const navigate = useNavigate();
  let location = ""

// ================= UseEffects ===================

  useEffect((): () => void => {
    socket.on('connect', () => {
    });
    socket.on("userJoinChannel", (obj: any) => {
      if (user.auth_id === obj.userid) {
          updateChanFromList(obj.chan, true);
      }
      getChan();
    });
    socket.on("chanDeleted", (/* roomId: string */) => {
      chanList.forEach((c: ChanType) => {
        if (c.chanUser.find((u: UserType) =>
          u.auth_id === user.auth_id) !== undefined) {
          getChan();
          window.location.href = "http://localhost:8080/chat"; //!
          return ;
        }
      })
    })
    socket.on("userLeaveChannel", (obj: any) => {
      if (user.auth_id === obj.userid) {
          updateChanFromList(obj.chan, false);
      }
      getChan();
      //window.location.replace("http://localhost:8080/chat");
      //navigate("/chat/")
    });
    if (chanList.length && user.auth_id !== undefined)
  		setLoaded('ok')
    return () => {
      socket.off('connect');
      socket.off('userJoinChannel');
      socket.off('chanDeleted');
      socket.off('userLeaveChannel');
    }
  });

  useEffect((): () => void => {
    const handleMute = async (obj: PunishSocketType): Promise<void> => {
      if (obj.auth_id === user.auth_id) {
        try {
          const chan: ChanType = await Request(
              "GET",
              {},
              {},
              "http://localhost:3000/chan/id/" + obj.room
          )
          updateMutedFromList(chan, obj.action)
        } catch (error) {
          setError(error);
        }
      }
      getChan()
    }
    const handleBan = async (obj: any): Promise<void> => {
      if (obj.auth_id === user.auth_id) {
        try {
          const chan: ChanType = await Request(
              "GET",
              {},
              {},
              "http://localhost:3000/chan/id/" + obj.room
          )
          updateBannedFromList(chan, obj.action);
          if (obj.action) {
            socket.emit("leaveRoom", {
              room: room,
              auth_id: user.auth_id
            }
            );
            changeActiveRoom("");
            setRoom("null");
            window.location.href = "http://localhost:8080/chat"; //!
          }
        } catch (error) {
          setError(error);
        }
      }
      getChan()
    }
    const handleAdmin = async (obj: PunishSocketType) => {
      if (obj.auth_id === user.auth_id) {
        try {
          const chan: ChanType = await Request(
              "GET",
              {},
              {},
              "http://localhost:3000/chan/id/" + obj.room
          )
          updateAdminFromList(chan, obj.action)
        } catch (error) {
          setError(error);
        }
      }
      getChan();
    }
    const handleError = (error: ErrorType, auth_id: string) => {
      if (auth_id === user.auth_id) {
        setError(error);
        if (error.statusCode === 450) {
          //updateBannedFromList();
          //navigate("/chat/");
        }
        if (error.statusCode === 451) {
          //updateMutedFromList();
        }
        if (error.statusCode === 452) {
          //updateChanFromList();
        }
      }
    }
    socket.on('mutedChannel', handleMute);
    socket.on('bannedChannel', handleBan);
    socket.on('adminChannel', handleAdmin);
    socket.on('error', handleError);
    return () => {
      socket.off('mutedChannel', handleMute);
      socket.off('bannedChannel', handleBan);
      socket.off('adminChannel', handleAdmin);
      socket.off('error', handleError);
    }
  }, [
    setError,
    socket,
    updateAdminFromList,
    updateBannedFromList,
    updateMutedFromList,
    user]);


  useEffect(() => {
    const handleOutBan = async (obj: any) => {
      if (obj.auth_id === user.auth_id) {
        try {
          const chan: ChanType = await Request(
              "GET",
              {},
              {},
              "http://localhost:3000/chan/id/" + obj.room
          )
          updateBannedFromList(chan, false)
        } catch (error) {
          setError(error);
        }
      }
      getChan()
    }
    const handleOutMute = async (obj: any) => {
      if (obj.auth_id === user.auth_id) {
        try {
          const chan: ChanType = await Request(
              "GET",
              {},
              {},
              "http://localhost:3000/chan/id/" + obj.room
          )
          updateMutedFromList(chan, false)
        } catch (error) {
          setError(error);
        }
      }
      getChan()
    }
    socket.on('timerOutMute', handleOutMute);
    socket.on('timerOutBan', handleOutBan);
    return () => {
      socket.off('timerOutMute', handleOutMute);
      socket.off('timerOutBan', handleOutBan);
    }
  }, [
      setError,
    updateMutedFromList,
    updateBannedFromList,
    user,
    socket])


  useEffect((): void => {
    getChan();
    const checkUrl: NodeJS.Timer = setInterval(() => {
      let url: string = document.URL
      if (!document.URL.includes("localhost:8080/chat"))
        clearInterval(checkUrl);
      url = url.substring(url.lastIndexOf("/") + 1)
      if (url !== location) {
        location = url
        joinUrl()
      }
    }, 10)
  }, [])

  useEffect((): void => {
    if (loaded === 'ok') {
      joinUrl()
    }
  }, [loaded])

  useEffect((): void => {
    joinUrl();
  }, [url])

  useEffect((): void => {
    const chanUserFind: Array<UserType>|undefined = chanList.find((c:ChanType) => c.id === room)?.chanUser
    if (chanUserFind !== undefined) {
      setChanUser(chanUserFind)
    }
  }, [room, chanList])

// ================= Fin UseEffects ===================

  const createChannel = async (
      name: string,
      typep: string,
      pass: string): Promise<void> => {
    let chans: Array<ChanType> = [];
    let chanCreated: ChanType | undefined = undefined;
    try {
      chans = await Request(
          'GET',
          {},
          {},
          "http://localhost:3000/chan/"
      )
      const found: ChanType | undefined = chans.find((c: ChanType) => c.name === name)
      if (found) {
        const error: ErrorType = {
          statusCode: 400,
          message: 'Error while creating new chan: Chan name is already taken',
        }
        setError(error);
        return;
      }
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
              owner: user.auth_id,
            },
            "http://localhost:3000/chan/create"
        );
          socket.emit('chanCreated', {
            chan: chanCreated,
            auth_id: user.auth_id,
          });
          //updateAllChans();
          updateAdminFromList(chanCreated, true);
          //updateChanFromList(chanCreated, true);
          navigate('/chat/' + chanCreated?.id);
          //!
          //await getChan();
          setUrl('/chat/' + chanCreated?.id);
          // joinRoom(chanCreated);
          // changeActiveRoom(chanCreated.id)
          //setRoom(chanCreated.id)
          //!
          // joinUrl();
          // setTimeout(joinUrl, 5000);
      } catch (error) {
        setError(error);
      }
    };

  const joinUrl = (): void => {
    let url: string = document.URL;
    // await getChan();
    // changeActiveRoom('4')
    // let chanList:ChanType[] = await Request('GET', {}, {}, "http://localhost:3000/chan/")
    let chan: ChanType | undefined = undefined;
    const index: number = url.lastIndexOf("/");
  	chanList.forEach((chan: ChanType) => {
  		if (chan.chanUser.find((u) =>
            u.auth_id === user.auth_id)) {
  			socket.emit("joinRoom", chan.id, user.auth_id);
  		}
  	})
    if (index === -1) {
      chan = chanList.find((c:ChanType) => {
        return c.chanUser.find((usr:UserType) => usr.auth_id === user.auth_id)
      });
      if (chan !== undefined) {
        joinRoom(chan)
      }
    }
    else {
      url = url.substring(url.lastIndexOf("/") + 1);
      chan = chanList.find((c:ChanType) => String(c.id) === url);
      if (chan !== undefined) {
        joinRoom(chan)
      }
      else {
        chan = chanList.find((c:ChanType) => {
          return c.chanUser.find((usr:UserType) => usr.auth_id === user.auth_id)
        });
        if (chan !== undefined) {
          joinRoom(chan)
        }
      }
    }
  }

  const getChan = async (): Promise<void> => {
    let channels: ChanType[] = [];
    try {
      channels = await Request(
          'GET',
          {},
          {},
          "http://localhost:3000/chan/")
      channels.forEach((c:ChanType, idx:number) => {
        if (c.id === room)
          c.isActive = true;
        if (c.messages) {
          c.messages.forEach((m:any, index:number) => {
            c.messages[index] = JSON.parse(String(m));
          })
        }
        channels[idx] = c;
      })
      setChanList(channels);
    } catch (error) {
      setError(error);
    }
  }

  const changeActiveRoom = (id: string): void => {
    const tmp: Array<ChanType> = chanList;
    tmp.forEach((chan) => {
      if (chan.id === id) {
        chan.isActive = true;
        setRoom(chan.id);
      }
      else
        chan.isActive = false;
    });
    setChanList(tmp);
  };

  const joinRoom = (newRoom: ChanType): void => {
     const chanToJoin: ChanType | undefined = chanList.find((chan: ChanType) => {
      return String(chan.id) === String(newRoom.id)
     })
    if (chanToJoin !== undefined) {
      if (chanToJoin.chanUser.find((u: UserType) => u.auth_id === user.auth_id)) {
        //updateChanFromList(chanToJoin, true);
        setRoom(chanToJoin.id);
        changeActiveRoom(newRoom.id);
        setChanUser(newRoom.chanUser);
        setCurrentChan(newRoom)
      } else {
        socket.emit("joinRoom", newRoom.id, user.auth_id);
        //updateChanFromList(chanToJoin, true);
        setRoom(chanToJoin.id);
        changeActiveRoom(chanToJoin.id);
        setCurrentChan(newRoom)
      }
      if (msgInput.current)
        msgInput.current.focus();
    }
  };

  const createChan = (): void => {
    const modal: HTMLElement | null = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove("hidden");
    setModalTitle("Create a new channel");
    setModalType("newChan");
  };

  const joinChan = (): void => {
    const modal: HTMLElement | null = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove("hidden");
    setModalTitle("Join a channel");
    setModalType("joinChan");
  };

  const arrayUserInActualchannel = (): UserType[] => {
    let users: Array<UserType> = [];
    const actualChan: ChanType | undefined = chanList.find((c: ChanType) => c.isActive);
    if (actualChan?.chanUser)
      users = actualChan.chanUser;
    return users;
  };

  const listChansJoined = (chan: Array<ChanType>): ChanType[] => {
    const ret: ChanType[] = [];
    for (let x: number = 0; x < chanList.length; x++)
      if (chan[x].chanUser.find((u: UserType) => u.auth_id === user.auth_id))
        ret.push(chan[x]);
    return ret;
  };

  return (
      <div>
        <div className="chat row">
          <h3 className="d-flex justify-content-start">Chat</h3>
          <Modal
              title={modalTitle}
              calledBy={modalType}
              userChan={arrayUserInActualchannel()}
              parentCallBack={{
                "socket": socket,
                "room": room,
                joinRoom,
                createChannel}}
              chans={listChansJoined(chanList)}
              chanList={chanList}/>
          <ChannelList
            chanList={chanList}
            room={room}
            user={user}
            parentCallBack={{createChan, joinChan, joinRoom}}
            />
            <PrintChannel
              msgInput={msgInput}
              value={value}
              chanList={chanList}
              user={user}
              room={room}
              usersInChan={chanUser}
              currentChan={currentChan}
              parentCallBack={{
                setModalType,
                setModalTitle,
                setValue,
                getChan,
                setChanList,
                changeActiveRoom,
                setRoom}}
               />
        </div>
      </div>
  ); // fin de return
};

class Chat extends Component<{}, {}> {
  render(): JSX.Element {
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
