import { Component } from 'react';
import Request from "./Requests"
import "../../styles/components/utils/modal.css";
import io from 'socket.io-client';
import { AuthContext } from '../../contexts/AuthProviderContext';
import {PartiesType} from "../../types";

const socket = io("http://localhost:3000/update");

class ModalMatch extends Component<{ title: string, calledBy: string }, {}> {

  static contextType = AuthContext;

  hidden = (): void => {
    let modal: HTMLElement | null = document.getElementById("ModalMatch") as HTMLDivElement;
    modal.classList.add('hidden')
  }

  createParties = async (isClassic: number): Promise<void> => {
    let currentUser: any = this.context;
    // console.log(currentUser.user.username)
    try {
      await Request(
        "POST",
        {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        {
          login: currentUser.user.username,
          public: true
        },
        "http://localhost:3000/parties/create"
      );
      socket.emit('newParty');
      let parties: PartiesType[] = await Request(
          'GET',
          {},
          {},
          "http://localhost:3000/parties/"
      )
      let ids: number[] = parties.map((p: any) => {
        return p.id;
      })
      this.hidden()
      if (isClassic)
        window.location.href = "http://localhost:8080/game/" + Math.max(...ids)//currentUser.user.username
      else
        window.location.href = "http://localhost:8080/gameup/" + Math.max(...ids)//currentUser.user.username
      } catch (error) {
       const ctx: any = this.context;
       ctx.setError(error);
    }
  }


  render(): JSX.Element {
    return (
      <div className='Modal hidden' id='ModalMatch'>
        <div className='p-4 pb-1'>
          <header className='mb-3'>
            <h2>{this.props.title}</h2>
          </header>
          <form className='mb-3'>
            <p>
              <input type="radio" name="playerNum" value="1" id="1" defaultChecked/>1 player<br />
              <input type="radio" name="playerNum" value="2" id="2" />2 players
            </p>
          </form>
          <footer>
            <button className='mx-1 btn btn-outline-dark shadow-none' onClick={this.hidden}>Cancel</button>
            <button className='mx-1 btn btn-outline-dark shadow-none' onClick={() => this.createParties(0)}>Create</button>
            <button className='mx-1 btn btn-outline-dark shadow-none' onClick={() => this.createParties(1)}>Create classic</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default ModalMatch;
