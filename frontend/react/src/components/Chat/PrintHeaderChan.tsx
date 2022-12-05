import { Component, useContext, useEffect, useState, useRef } from "react";
import {Link, useNavigate} from "react-router-dom";
import Modal from "../utils/Modal";
import UserCards from '../utils/UserCards'
import Request from "../utils/Requests"
import { socket, WebsocketProvider, WebsocketContext } from '../../contexts/WebSocketContext';
import {MessagePayload, ChanType, UserType, PunishSocketType, ErrorType} from "../../types"
import {AuthContext, useAuthData} from "../../contexts/AuthProviderContext";
import ModalBanUser from '../utils/ModalBanUser';
import ModalMuteUser from '../utils/ModalMuteUser';
import ModalAdminUser from "../utils/ModalAdminUser";

class AdminButtons extends Component<
    {
        room: any,
        socket: any,
        user: UserType,
        chanList: ChanType[]
    },
    {
        adminList: UserType[],
    }> {
    static contextType = AuthContext;
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            adminList: [],
        }
    }
    componentDidMount = async () => {
        const ctx: any = this.context;
        this.setState({adminList: ctx.adminList})
    }

    componentDidUpdate(
        prevProps: Readonly<{
            room: any;
            socket: any;
            user: UserType;
            chanList: ChanType[]
        }>,
        prevState: Readonly<{
            adminList: UserType[],
        }>,
        snapshot?: any) {
        const ctx: any = this.context;
        /*
        let users: UserType[] = await Request(
            "GET",
            {},
            {},
            "http://localhost:3000/chan/" + prevProps.room + "/user"
        )
         */
        if (prevState.adminList !== ctx.adminFrom) {
            this.setState({adminList: ctx.adminFrom});
        }
        this.render();

    }

    isUserAdmin = () => {
        return this.state.adminList && this.state.adminList.findIndex((c: any) => c.id === this.props.room) > -1;
    }

    render() {
    let chan = this.props.chanList[this.props.chanList.findIndex((c: ChanType) => c.id === this.props.room)]
    if (!chan) {
        return ;
    }
    if (this.isUserAdmin()) {
      return (
         <div className="row">
             <ModalBanUser chan={this.props.room} socket={this.props.socket}/>
             <ModalMuteUser chan={this.props.room} socket={this.props.socket} />
             <ModalAdminUser chan={this.props.room} socket={this.props.socket} />
         </div>
      )
    }
  }
}

class PrintAddUserButton extends Component<{chanList: ChanType[], parentCallBack: any}, {}> {
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
    if (id && id > 0 && this.props.chanList[id - 1] && !(this.props.chanList[id - 1].type === "direct")) {
      return (<button id="addPeople" className="col-2" onClick={this.promptAddUser}>Add Peoples</button>)
    }
  }
}

export const PrintHeaderChan = (
  {chanList, room, socket, user, parentCallBack}:
  {chanList: ChanType[], room: any, user: UserType, socket: any, parentCallBack: any}) => {
    const setModalType = (newValue: any) => {
      parentCallBack.setModalType(newValue)
    }
    const setModalTitle = (newValue: any) => {
      parentCallBack.setModalTitle(newValue)
    }
    return (
        <div className="chatMainTitle row">
          {/* <h3 className="col-10">Channel Name</h3> */}
          <PrintAddUserButton chanList={chanList} parentCallBack={{setModalType, setModalTitle}} />
          <AdminButtons room={room} socket={socket} user={user} chanList={chanList} />
        </div>
    )
}

export default PrintHeaderChan;
