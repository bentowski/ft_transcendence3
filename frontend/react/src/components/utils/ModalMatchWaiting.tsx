import { Component } from 'react';
import Request from "./Requests"
import "../../styles/components/utils/modal.css";
import { io } from 'socket.io-client';
import { AuthContext } from '../../contexts/AuthProviderContext';

const socket = io("http://localhost:3000/chat");

class ModalMatchWaiting extends Component<{ title: string, calledBy: string, hidden?: boolean, user?: any}, {}> {

  static contextType = AuthContext;

  hidden = () => {
    let modal = document.getElementById("ModalMatchWaiting") as HTMLDivElement;
    modal.classList.add('hidden')
    socket.emit("askForGamedown", {"to": this.props.user.auth_id, "from": this.getCurrentUser().auth_id})
  }

  getCurrentUser = () => {
    const ctx: any = this.context;
    return ctx.user;
  };

  render() {
    return (
      <div className={this.props.hidden ? "Modal hidden" : "Modal"} id='ModalMatchWaiting'>
        <div className='p-4 pb-1'>
          <header className='mb-3'>
            <h2>
              Waiting for { this.props.user !== undefined ? this.props.user.username : "opponent"}
            </h2>
              <div className=''></div>
          </header>
          <footer>
            <button onClick={this.hidden}>cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default ModalMatchWaiting;
