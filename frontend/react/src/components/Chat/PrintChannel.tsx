import { Component, useContext, useEffect, useState, useRef } from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import Modal from "../utils/Modal";
import UserCards from '../utils/UserCards'
import Request from "../utils/Requests"
import { socket, WebsocketProvider, WebsocketContext } from '../../contexts/WebSocketContext';
import { MessagePayload, ChanType, UserType, PunishSocketType, ErrorType } from "../../types"
import { useAuthData } from "../../contexts/AuthProviderContext";
import ModalBanUser from '../utils/ModalBanUser';
import ModalMuteUser from '../utils/ModalMuteUser';
import { PrintHeaderChan } from './PrintHeaderChan'
import { PrintMessages } from './PrintMessages'

class UsersInActualchannel extends Component<{ usersList: UserType[] }, {}> {
  render() {
    let users: any = [];
    const actualChan = this.props.usersList;
    if (actualChan.length)
      actualChan.map((u: UserType) => {
        users.push(<div key={u.user_id}><UserCards user={u} avatar={false} stat={false} /></div>)
      })
    return users;
  }
}

export const PrintChannel = (
  {msgInput, value, chanList, user, room, usersInChan, currentChan, parentCallBack}:
  {msgInput: any, value: any, chanList: ChanType[], user: UserType, room: any, usersInChan: UserType[], currentChan: any, parentCallBack: any}) => {
  const { mutedFrom, bannedFrom } = useAuthData();
  const navigate = useNavigate();

  // const {user} = useAuthData()
  const setModalType = (newValue: any) => {
    parentCallBack.setModalType(newValue)
  }

  const setModalTitle = (newValue: any) => {
    parentCallBack.setModalTitle(newValue)
  }

  const setValue = (newValue: any) => {
    parentCallBack.setValue(newValue)
  }

  const setChanList = (newValue: any) => {
    parentCallBack.setChanList(newValue)
  }

  useEffect(() => {
    console.log('use effect ban cycle')
    const checkIfBanned = async () => {
      console.log('banned from = ', bannedFrom, ', room = ', room)
      let ban = await Request(
          "GET",
          {},
          {},
          "http://localhost:3000/user/chan/banned"
      )
      for (let i = 0; i < ban.length; i++) {
        if (ban[i].id === room) {
          console.log('this user is banned');
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

  const checkIfMuted = async () => {
    let mutedList = await Request(
        "GET",
        {},
        {},
        "http://localhost:3000/user/chan/muted"
    )
    console.log('muted list = ', mutedList, ', room = ', room);
    for (let i = 0; i < mutedList.length; i++) {
      if (mutedList[i].id === room) {
        return true;
      }
    }
    return false;
  }

  const onSubmit = async () => {
    // check if array is empty or contain only whitespace
if (!await checkIfMuted()) {
    if (value !== "" && value.replace(/\s/g, "") !== "" && room !== undefined) {
      if (value === "/leave") {
        socket.emit("leaveRoom", { room: room, auth_id: user.auth_id });
        parentCallBack.changeActiveRoom("");
        // parentCallBack.setMessage([]);
        parentCallBack.setRoom("null");
        parentCallBack.getChan();
        // window.location.href = "http://localhost:8080/chat"; //!
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
      setValue("");
        } else {
      setValue("Youve been muted");
      setTimeout(() => {
        setValue("");
      }, 1800)
    }

  const pressEnter = (e: any) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const printName = () => {
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
    // console.log("name",currentChan.chanUser[0].auth_id)
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
          <PrintHeaderChan chanList={chanList} room={room} socket={socket} user={user} parentCallBack={{ setModalType, setModalTitle }} />
          <div className="row">
            <div>
              <PrintMessages user={user} currentChan={currentChan} chanList={chanList} parentCallBack={{ setChanList }} />
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
          <p> Channel's members ({usersInChan.length}) </p>
          <UsersInActualchannel usersList={usersInChan} />
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
