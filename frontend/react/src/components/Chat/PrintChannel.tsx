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
import { PrintHeaderChan } from './PrintHeaderChan'
import { PrintMessages } from './PrintMessages'

class UsersInActualchannel extends Component<{usersList: UserType[]}, {}> {
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

  const onSubmit = () => {
    // check if array is empty or contain only whitespace
    if (value !== "" && value.replace(/\s/g, "") !== "" && room !== undefined) {
      if (value === "/leave") {
        socket.emit("leaveRoom", { room: room, auth_id: user.auth_id });
        parentCallBack.changeActiveRoom("");
        parentCallBack.setMessage([]);
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
  };

  const pressEnter = (e: any) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  if (room) {
    return (
        <div className="inChat row col-10">
          <div className="chatMain col-10">
            <PrintHeaderChan chanList={chanList} room={room} socket={socket} user={user} parentCallBack={{setModalType, setModalTitle}} />
            <div className="row">
              <div>
              <PrintMessages user={user} currentChan={currentChan} chanList={chanList} parentCallBack={{setChanList}}/>
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
            <UsersInActualchannel usersList={usersInChan}/>
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
