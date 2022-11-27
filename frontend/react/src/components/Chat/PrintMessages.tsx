// import { Component, useContext, useEffect, useState, useRef } from "react";
// import {Link, useNavigate} from "react-router-dom";
// import Modal from "../utils/Modal";
// import UserCards from '../utils/UserCards'
// import Request from "../utils/Requests"
// import { socket, WebsocketProvider, WebsocketContext } from '../../contexts/WebSocketContext';
// import {MessagePayload, ChanType, UserType, PunishSocketType, ErrorType} from "../../types"
// import { useAuthData } from "../../contexts/AuthProviderContext";
// import ModalBanUser from '../utils/ModalBanUser';
// import ModalMuteUser from '../utils/ModalMuteUser';
//
// class DispatchMsg extends Component<{}, {}> {
//   render() {
//     let ret: any[] = []
//     messages.map((msg: MessagePayload, index: number) => {
//       if (msg.sender_socket_id === user.auth_id)
//         ret.push(
//             <div key={index} className="outgoing_msg break-text">
//               <div className="sent_msg">
//                 <p>{msg.content}</p>
//               </div>
//             </div>
//         )
//       else
//         ret.push(
//             <div key={index} className="incoming_msg break-text">
//               <div className="incoming_msg_img align-bottom"> <img src={"http://localhost:3000/user/" + msg.auth_id + "/avatar"} alt="ImageNotFound" /> </div>
//               <div className="received_msg">
//                 <div className="received_withd_msg">
//                   <div className="received_withd_msg"><span className="time_date"> {msg.username}</span></div>
//                   <p>{msg.content}</p>
//                 </div>
//               </div>
//             </div>
//         )
//     })
//     return ret
//   }
// }
//
//   class PrintMessages extends Component<{}, {}>{
//     render() {
//       if (messages.length === 0) {
//         return (<div>No messages here</div>)
//       } else {
//         return (
//             <div className='messages'>
//               <DispatchMsg />
//             </div>
//         )
//       }
//     }
//   }
//
// export default PrintMessages;
