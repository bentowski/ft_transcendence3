import { Component } from 'react';
import "../../styles/utils/modal.css";

class Modal extends Component<{ title: string }, {}> {

  hidden = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.add('hidden')
  }

  // prompt = () => {
  //   let modal = document.getElementById("Modal") as HTMLDivElement;
  //   modal.classList.remove('hidden')
  // }

  render() {
    return (
      <div className='Modal' id='Modal'>
        <div className='Modalwin p-4 pb-2'>
          <header>
            <h2>{this.props.title}</h2>
          </header>
          <footer>
            <button className='mx-1' onClick={this.hidden}>Cancel</button>
            <button className='mx-1'>Create</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default Modal;