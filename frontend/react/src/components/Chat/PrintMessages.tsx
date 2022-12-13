import { Component, useEffect, useState } from "react";
import { useAuthData } from "../../contexts/AuthProviderContext";
import { socket } from '../../contexts/WebSocketContext';
import { MessagePayload, ChanType, UserType } from "../../types"
import Request from "../utils/Requests"
import { io } from "socket.io-client";

// const socket = io('http://localhost:3000/chat')

const DispatchMsg = ({user, messages}:{user: UserType, messages: any}) => {
	// constructor(props: any, context: any) {
  //       super(props, context);
  //       this.state = {
  //           userList: [],
  //       }
  //   }

  const [msgs, setMsgs] = useState<JSX.Element>();
  const [needUpdate, setNeedUpdate] = useState(1);
  const { userList } = useAuthData();
	// componentDidUpdate(): void {
		
    //     const ctx: any = this.context;
	// 	console.log(ctx.userList)
    //     // this.setState({userList: ctx.adminList})
    // }

	// updateUsers = async () => {
	// 	let users:UserType = await Request("GET", {}, {}, "http://localhost:3000/user")
	// 	this.setState({userList: users})
	// }

  useEffect(() => {
    socket.on("imgUpdated", () => {
      console.log("ca marche")
      setTimeout(() => render(), 5000);gi
      //setNeedUpdate(needUpdate + 1)
    })
  })

	const takeUsername = (msg: MessagePayload) => {
    let user:UserType | undefined = undefined;
    if (userList)
		  user = (userList.find((user:UserType) => user.auth_id === msg.auth_id))
		if (user !== undefined)
			return user.username
		return msg.username
	}

  const render = () => {
    let ret: JSX.Element[] = [];
    if (!messages)
      return <></>;
      messages.forEach((msg: MessagePayload, index: number) => {
      if (msg.username === undefined)
			  msg = JSON.parse(String(msg))
        console.log("http://localhost:3000/user/" + msg.auth_id + "/avatar")
      if (msg.sender_socket_id === user.auth_id)
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
                  <div className="received_withd_msg"><span className="time_date">{takeUsername(msg)}</span></div>
                  <p>{msg.content}</p>
                </div>
              </div>
            </div>
        )
    })
    setMsgs (
      <div>
        {ret}
      </div>)
  }
  if (!msgs) {
    render()
    return <></>
  }
  return msgs;
}

  export const PrintMessages = ({
                                  user,
                                  currentChan,
                                  chanList,
                                  parentCallBack}: {
    user: UserType,
    currentChan: ChanType,
    chanList: ChanType[],
    parentCallBack: any
  }): JSX.Element => {
    const [messages, setMessage] = useState<MessagePayload[]>([]);

      useEffect((): () => void => {
        socket.on('onMessage', (newMessage: MessagePayload) => {
          const channels: Array<ChanType> = chanList;
          const index: number =
              chanList.findIndex((c: ChanType) => c.id === newMessage.room);
          if (channels[index] !== undefined) {
            if (channels[index].messages)
              channels[index].messages =
                  [...channels[index].messages, newMessage];
            else
              channels[index].messages = [newMessage];
            if (channels[index].isActive) {
              if (channels[index].messages)
                setMessage(channels[index].messages);
              else
                setMessage([])
            }
            parentCallBack.setChanList(channels);
          }
        });
        return () => {
          socket.off('onMessage');
        }
      });

      useEffect((): void => {
        if (currentChan && currentChan.messages) {
          setMessage(currentChan.messages);
        }
        else {
          setMessage([]);
        }
        console.log("OUI")
      }, [currentChan]);

      // useEffect((): void => {
      //   socket.on("imgUpdated", () => {

      //   });
      // }, []);

      if (messages.length === 0) {
        return (<div>No messages here</div>)
      } else {
        return (
            <div className='messages mt-3'>
              <DispatchMsg user={user} messages={messages}/>
            </div>
        )
      }
  }

export default PrintMessages;
