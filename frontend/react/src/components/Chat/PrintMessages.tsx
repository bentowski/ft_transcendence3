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

class DispatchMsg extends Component<{user: UserType, messages: any}, {}> {
  render() {
    let ret: any[] = []
    this.props.messages.map((msg: MessagePayload, index: number) => {
      if (msg.sender_socket_id === this.props.user.auth_id)
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
              <div className="incoming_msg_img align-bottom"> <img src={"http://localhost:3000/user/" + msg.auth_id + "/avatar"} alt="ImageNotFound" /> </div>
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

  export const PrintMessages = ({user, currentChan, chanList, parentCallBack}: {user: UserType, currentChan: ChanType, chanList: ChanType[], parentCallBack: any}) => {

    const [messages, setMessage] = useState<MessagePayload[]>([]);
      useEffect(() => {
        socket.on('onMessage', (newMessage: MessagePayload) => {
          let channels: Array<ChanType> = chanList;
          let index: number = chanList.findIndex((c: ChanType) => c.id === newMessage.room);
          if (channels[index] !== undefined) {
            if (channels[index].messages)
              channels[index].messages = [...channels[index].messages, newMessage];
            else
              channels[index].messages = [newMessage];
            parentCallBack.setChans(channels);
            if (channels[index].isActive) {
              if (channels[index].messages)
                setMessage(channels[index].messages);
              else
                setMessage([])
            }
          }
          return () => {
            socket.off('newChan');
          }
        });
      });

      useEffect(() => {
        if (currentChan && currentChan.messages) {
          setMessage(currentChan.messages);
        }
        else {
          setMessage([]);
        }
      }, [currentChan]);

      if (messages.length === 0) {
        return (<div>No messages here</div>)
      } else {
        return (
            <div className='messages'>
              <DispatchMsg user={user} messages={messages}/>
            </div>
        )
      }
  }

export default PrintMessages;
