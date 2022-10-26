import { Component } from 'react';
import "../../styles/components/utils/modal.css";

class ModalMatch extends Component<{ title: string, calledBy: string }, {}> {

  hidden = () => {
    let modal = document.getElementById("ModalMatch") as HTMLDivElement;
    modal.classList.add('hidden')
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
            <button className='mx-1'>Create</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default ModalMatch;
