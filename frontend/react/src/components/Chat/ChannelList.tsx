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


class ListOfDirectMessages extends Component<{chanList: ChanType[], user: UserType, parentCallBack: any}, {}>{
  render() {
    let ret: any[] = []
    this.props.chanList.map((chan) => {
          if (chan.type === "direct")
            ret.push(
                <Link key={chan.id} to={"/chat/" + chan.id}>
                  <li onClick={() => this.props.parentCallBack.joinRoom(chan)} className={"d-flex flex-row d-flex justify-content-between align-items-center m-2 list-group-item " + (this.props.parentCallBack.chanColor(chan))}>
                    {this.props.parentCallBack.printName(chan, this.props.user)}
                  </li>
                </Link>
            )
        }
    )
    return ret
  }
}

class ListOfJoinedChans extends Component<{chanList: ChanType[], user: UserType, parentCallBack: any}, {}> {
  render() {
    let ret: any[] = []
    this.props.chanList.map((chan: ChanType) => {
          if (chan.type !== "direct" && this.props.parentCallBack.inChan(chan))
            ret.push(
                <Link key={chan.id} to={"/chat/" + chan.id}>
                  <li onClick={() => this.props.parentCallBack.joinRoom(chan)} className={"d-flex flex-row d-flex justify-content-between align-items-center m-2 list-group-item " + (this.props.parentCallBack.chanColor(chan))}>
                    {this.props.parentCallBack.printName(chan, this.props.user)}
                  </li>
                </Link>
            )
        }
    )
    return ret
  }
}
// export const WebSocket
export const ChannelList = (
  {chanList, room, user, parentCallBack}:
  {chanList: ChanType[], room: string, user: UserType, parentCallBack: any}) => {

  const chansJoined = (chans: Array<ChanType>) => {
    let count = 0;
    for (let x = 0; x < chanList.length; x++)
      if (chans[x].chanUser.find((u: UserType) => u.auth_id === user.auth_id))
        count++;
    return count;
  }

  const printName = (chan: ChanType, user: UserType) => {
    if (chan && chan.type === "direct") {
      if (user.username === chan.chanUser[0].username)
        return chan.chanUser[1].username;
      else
        return chan.chanUser[0].username;
    }
    else
      return chan.name;
  };

  const chanColor = (channel: ChanType, room: string) => {
    if (channel.id === room)
      return ("bg-primary");
    else
      return ("bg-white")
  }


  const inChan = (chan: ChanType) => {
    if (chan.chanUser.find((u: UserType) => u.auth_id === user.auth_id))
      return 1
    return 0
  }

  const joinRoom = (chan: ChanType) => {
    parentCallBack.joinRoom(chan)
  }
  

    return (
      <div className="channels col-2">
        <button className="btn btn-outline-dark shadow-none" onClick={parentCallBack.createChan}>Create Channel</button>
        <button className="btn btn-outline-dark shadow-none" onClick={parentCallBack.joinChan}>Join Channel</button>
        <div className="channelsList">
          <p>{chansJoined(chanList)} Channels</p>
          <div className="list-group">
            <ul>
              <ListOfJoinedChans
                chanList={chanList}
                user={user}
                parentCallBack={{printName, chanColor, joinRoom, inChan}}
                />
            </ul>
            <ul>
              <ListOfDirectMessages
                chanList={chanList}
                user={user}
                parentCallBack={{printName, chanColor, joinRoom}}
                />
            </ul>
          </div>
          </div>
        </div>
    )
}

export default ChannelList;
