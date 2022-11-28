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

class AdminButtons extends Component<{room: any, socket: any, user: UserType, chans: ChanType[]}, {}> {
  render() {
    let chan = this.props.chans[this.props.chans.findIndex((c: ChanType) => c.id === this.props.room)]
    let tab: any[] = chan.admin
    if ((tab && tab.findIndex((u: any) => u === this.props.user.username) > -1) || chan.owner === this.props.user.username) {
      return (
          <div className="row">
            <ModalBanUser chan={this.props.room} socket={this.props.socket}/>
            <ModalMuteUser chan={this.props.room} socket={this.props.socket} />
          </div>
      )
    }
  }
}

class PrintAddUserButton extends Component<{chans: ChanType[], parentCallBack: any}, {}> {
  promptAddUser = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove("hidden");
    this.props.parentCallBack.setModalType("addUser");
    this.props.parentCallBack.setModalTitle("Add a user");
  };
  render() {
    let url: string = document.URL
    url = url.substring(url.lastIndexOf("/") + 1);
    let id = parseInt(url)
    if (id && id > 0 && this.props.chans[id - 1] && !(this.props.chans[id - 1].type === "direct")) {
      return (<button id="addPeople" className="col-2" onClick={this.promptAddUser}>Add Peoples</button>)
    }
  }
}

export const PrintHeaderChan = (
  {chanList, parentRoom, parentSocket, parentUser, callBack}:
  {chanList: ChanType[], parentRoom: any, parentUser: UserType, parentSocket: any, callBack: any}) => {
    const setModalType = (newValue: any) => {
      callBack.setModalType(newValue)
    }
    const setModalTitle = (newValue: any) => {
      callBack.setModalTitle(newValue)
    }
    return (
        <div className="chatMainTitle row">
          <h1 className="col-10">Channel Name</h1>
          <PrintAddUserButton chans={chanList} parentCallBack={{setModalType, setModalTitle}} />
          <AdminButtons room={parentRoom} socket={parentSocket} user={parentUser} chans={chanList} />
        </div>
    )
}

export default PrintHeaderChan;
