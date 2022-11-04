import { Component } from 'react';
import Request from "./Requests"
import "../../styles/components/utils/modal.css";

class ModalMatch extends Component<{ title: string, calledBy: string }, {}> {

  hidden = () => {
    let modal = document.getElementById("ModalMatch") as HTMLDivElement;
    modal.classList.add('hidden')
  }

  createParties = async () => {
    let currentUser: any = sessionStorage.getItem("data");
    currentUser = JSON.parse(currentUser);
    // console.log(currentUser.user.username)
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
    let parties = await Request('GET', {}, {}, "http://localhost:3000/parties/")
    let ids = parties.map((p:any) => {
      return p.id;
    })
    this.hidden()
    window.location.href = "http://localhost:8080/game/" + Math.max(...ids)//currentUser.user.username
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
              <input type="radio" name="playerNum" value="1" id="1" />1 player<br />
              <input type="radio" name="playerNum" value="2" id="2" />2 players
            </p>
          </form>
          <footer>
            <button className='mx-1' onClick={this.hidden}>Cancel</button>
            <button className='mx-1' onClick={this.createParties}>Create</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default ModalMatch;
