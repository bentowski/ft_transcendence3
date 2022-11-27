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

class UsersInActualchannel extends Component<{chanUser: ChanType}, {}> {
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

export const PrintChannel = (
  {msgInput, value, user, room}:
  {msgInput: any, value: any, user: UserType, room: any}) => {

  const onSubmit = () => {
    // check if array is empty or contain only whitespace
    if (value !== "" && value.replace(/\s/g, "") !== "" && room !== undefined) {
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

  const pressEnter = (e: any) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  if (room) {
    // <PrintMessages />
    // <PrintHeaderChan />
    return (
        <div className="inChat row col-10">
          <div className="chatMain col-10">
            <div className="row">
              <div>
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
  else
    return (
      <div>
      </div>
    )
}

  export default PrintChannel;
