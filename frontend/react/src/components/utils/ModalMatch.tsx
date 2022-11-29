import { Component } from 'react';
import Request from "./Requests"
import "../../styles/components/utils/modal.css";
import io from 'socket.io-client';
import { AuthContext } from '../../contexts/AuthProviderContext';

const socket = io("http://localhost:3000/update");

class ModalMatch extends Component<{ title: string, calledBy: string }, {}> {

  static contextType = AuthContext;

  hidden = () => {
    let modal = document.getElementById("ModalMatch") as HTMLDivElement;
    modal.classList.add('hidden')
  }

  createParties = async () => {
    let currentUser: any = this.context;
    // console.log(currentUser.user.username)
    // try {
      let nbPlayers = 1;
      let choose1 = document.getElementById("choose1") as HTMLInputElement
      let choose2 = document.getElementById("choose2") as HTMLInputElement
      if (choose1.checked)
        nbPlayers = 1;
      else if (choose2.checked)
        nbPlayers = 2;
      await Request(
        "POST",
        {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        {
          login: currentUser.user.username,
          nbplayers: nbPlayers
        },
        "http://localhost:3000/parties/create"
      );
      socket.emit('newParty');
      let parties = await Request('GET', {}, {}, "http://localhost:3000/parties/")
      let ids = parties.map((p: any) => {
        return p.id;
      })
      this.hidden()
      window.location.href = "http://localhost:8080/game/" + Math.max(...ids)//currentUser.user.username
    // } catch (error) {
    //   const ctx: any = this.context;
    //   ctx.setError(error);
    // }
  }


  render() {
    return (
      <div className='Modal hidden' id='ModalMatch'>
        <div className='p-4 pb-1'>
          <header className='mb-3'>
            <h2>{this.props.title}</h2>
          </header>
          <form className='mb-3'>
            <p>
              <input type="radio" name="playerNum" value="1" id="choose1" defaultChecked />1 player<br />
              <input type="radio" name="playerNum" value="2" id="choose2" />2 players
            </p>
          </form>
          <footer>
            <button className='mx-1 btn btn-outline-dark shadow-none' onClick={this.hidden}>Cancel</button>
            <button className='mx-1 btn btn-outline-dark shadow-none' onClick={this.createParties}>Create</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default ModalMatch;
