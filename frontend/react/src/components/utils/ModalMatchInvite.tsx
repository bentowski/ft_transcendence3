import { Component } from 'react';
import Request from "./Requests"
import "../../styles/components/utils/modal.css";
import { io } from 'socket.io-client';
import { AuthContext } from '../../contexts/AuthProviderContext';
import {PartiesType, UserType} from "../../types";

const socket = io("http://localhost:3000/update");

class ModalMatchInvite extends Component<{ title: string, calledBy: string, user: any}, {}> {

  static contextType = AuthContext;

  accept = async (): Promise<void> => {
    const ctx: any = this.context;
    try {
      await Request(
          "POST",
          {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          {
            login: this.getCurrentUser().username + "-" + this.props.user.username,
            public: true
          },
          "http://localhost:3000/parties/create"
      );
    } catch (error) {
      ctx.setError(error);
    }
    this.hidden();
    let parties: PartiesType[] = [];
    try {
      parties = await Request(
        'GET',
        {},
        {},
        "http://localhost:3000/parties/"
     )
    } catch (error) {
      ctx.setError(error);
    }
    const party: PartiesType | undefined = parties.find((p:any) => p.login === this.getCurrentUser().username + "-" + this.props.user.username)
    socket.emit('inviteAccepted', {"to": this.props.user.auth_id, "from": this.getCurrentUser().auth_id, "partyID": party?.id})
    window.location.href = "http://localhost:8080/game/" + party?.id;
  }

  decline = (): void => {
    socket.emit('inviteDeclined', {"to": this.props.user.auth_id, "from": this.getCurrentUser().auth_id})
    this.hidden();
  }

  hidden = (): void => {
    const modal: HTMLElement | null = document.getElementById("ModalMatchInvite" + this.props.user.username) as HTMLDivElement;
    modal.classList.add('hidden')
  }

  getCurrentUser = (): UserType => {
    const ctx: any = this.context;
    return ctx.user;
  };

  render(): JSX.Element {
    return (
      <div className="Modal hidden" id={"ModalMatchInvite" + this.props.user.username}>
        <div className='p-4 pb-1'>
          <header className='mb-3'>
            <h2>
              You received an invitation
            </h2>
            <div className="d-flex flex-column justify-content-center">
              <img alt="" src={"http://localhost:3000/user/" +
                  this.props.user.auth_id +
                  "/avatar"} className='modifAvatar mx-auto'></img>
              <div>
                <b>{this.props.user.username}</b>
              </div>
              <div className="d-flex justify-content-around">
                <button className="btn btn-success shadow-none" onClick={this.accept}>Accept</button>
                <button className="btn btn-danger shadow-none" onClick={this.decline}>Decline</button>
              </div>
            </div>
          </header>
          <footer>
            {/* <button onClick={this.hidden}>cancel</button> */}
          </footer>
        </div>
      </div>
    );
  }
}

export default ModalMatchInvite;
