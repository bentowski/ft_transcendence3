import { Component, useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../utils/Modal";
import UserCards from '../utils/UserCards'
import Request from "../utils/Requests"
import { socket, WebsocketProvider, WebsocketContext } from '../../contexts/WebSocketContext';
import { MessagePayload, ChanType, UserType, PunishSocketType, ErrorType } from "../../types"
import {AuthContext, useAuthData} from "../../contexts/AuthProviderContext";
import ModalBanUser from '../utils/ModalBanUser';
import ModalMuteUser from '../utils/ModalMuteUser';
import { PrintHeaderChan } from './PrintHeaderChan'
import { PrintMessages } from './PrintMessages'
import ChannelList from "./ChannelList";

class UsersInActualchannel extends Component<{
  room: string,
  usersList: UserType[]
}, {
  usersChan: UserType[]
}> {
  /*
  constructor(props: any) {
    super(props);
    this.state = {
      usersChan: [],
    }
  }

  componentDidMount() {
    this.setState({usersChan: this.props.usersList})
  }

  async componentDidUpdate(
      prevProps: Readonly<{
        usersList: UserType[] }>,
      prevState: Readonly<{
        usersChan: UserType[]
      }>,
      snapshot?: any) {
    if (prevState.usersChan !== this.props.usersList) {
      this.setState({usersChan: this.props.usersList});
    }
  }
   */

  render(): JSX.Element[] {
    const users: JSX.Element[] = [];
    const actualChan = this.props.usersList;
    if (actualChan.length)
      actualChan.map((u: UserType) => {
        users.push(
            <div key={u.user_id}>
              <UserCards user={u} avatar={false} stat={false} />
            </div>)
      })
    return users;
  }
}

export const PrintChannel = (
  {
    msgInput,
    value,
    chanList,
    user,
    room,
    usersInChan,
    currentChan,
    parentCallBack
  }:
  {
    msgInput: any,
    value: any,
    chanList: ChanType[],
    user: UserType,
    room: any,
    usersInChan: UserType[],
    currentChan: any,
    parentCallBack: any
  }): JSX.Element => {
  const { setError, mutedFrom, bannedFrom } = useAuthData();
  const navigate = useNavigate();


  // const {user} = useAuthData()
  const setModalType = (newValue: any): void => {
    parentCallBack.setModalType(newValue)
  }

  const setModalTitle = (newValue: any): void => {
    parentCallBack.setModalTitle(newValue)
  }

  const setValue = (newValue: any): void => {
    parentCallBack.setValue(newValue)
  }

  const setChanList = (newValue: any): void => {
    parentCallBack.setChanList(newValue)
  }

  /*
  useEffect(() => {
    const checkIfBanned = async () => {
      let ban = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/chan/banned"
      )
      for (let i = 0; i < ban.length; i++) {
        if (ban[i].id === room) {
          socket.emit("leaveRoom", {room: room, auth_id: user.auth_id});
          parentCallBack.changeActiveRoom("");
          parentCallBack.setMessage([]);
          parentCallBack.setRoom("null");
          parentCallBack.getChan();
          window.location.href = "http://localhost:8080/chat"; //!
        }
      }
    }
    checkIfBanned();
  }, [bannedFrom])
  */

  const checkIfMuted = async (): Promise<boolean> => {
    let mutedList: ChanType[] = [];
    try {
      mutedList = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/chan/muted"
      )
    } catch (error) {
      setError(error);
    }
    for (let i: number = 0; i < mutedList.length; i++) {
      if (mutedList[i].id === room) {
        return true;
      }
    }
    return false;
  }

  const onSubmit = async (): Promise<void> => {
    // check if array is empty or contain only whitespace
    if (!await checkIfMuted()) {
      if (value !== "" && value.replace(/\s/g, "") !== "" && room !== undefined) {
        if (value === "/leave") {
          socket.emit("leaveRoom", {room: room, auth_id: user.auth_id});
          parentCallBack.changeActiveRoom("");
          //parentCallBack.setMessage([]);
          parentCallBack.setRoom("null");
          parentCallBack.getChan();
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
    } else {
      setValue("Youve been muted");
      setTimeout(() => {
        setValue("");
      }, 1800)
    }
  };

  const pressEnter = (e: any): void => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const printName = (): JSX.Element => {
    if (currentChan.type === "direct") {
      if (user.auth_id === currentChan.chanUser[0].auth_id) {
        return (
          <h3>{currentChan.chanUser[1].username}</h3>
        )
      }
      else {
        return (
          <h3>{currentChan.chanUser[0].username}</h3>
        )
      }
    }
    return (
      <h3>{currentChan.name}</h3>
    )
  };

  if (room) {
    return (
      <div className="inChat row col-10">
        <div>
          {printName()}
        </div>
        <div className="chatMain col-10">
          <PrintHeaderChan
              chanList={chanList}
              usersInChan={usersInChan}
              room={room}
              socket={socket}
              user={user}
              parentCallBack={{ setModalType, setModalTitle }} />
          <div className="row">
            <div>
              <PrintMessages
                  user={user}
                  currentChan={currentChan}
                  chanList={chanList}
                  parentCallBack={{ setChanList }} />
              <div className="row">
                <div>
                   <input
                       id="message"
                       ref={msgInput}
                       className="col-10"
                       type="text"
                       placeholder="type your message"
                       value={value}
                       onChange={(e) => setValue(e.target.value)}
                       onKeyDown={pressEnter}
                   />
                   <button className="col-1" onClick={onSubmit}>Send</button>
                </div>
              </div>
            </div>
          </div>
        </div> {/*fin chatMain*/}
        <div className="chatMembers col-2">
          <p> Channel's members ({usersInChan.length}) </p>
          <UsersInActualchannel room={room} usersList={usersInChan} />
        </div>
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default PrintChannel;
