import { Component } from 'react';
import Request from "./Requests"
import "../../styles/components/utils/modal.css";

class ModalMatchWaiting extends Component<{ title: string, calledBy: string }, {}> {

  hidden = () => {
    let modal = document.getElementById("ModalMatchWaiting") as HTMLDivElement;
    modal.classList.add('hidden')
  }

  render() {
    return (
      <div className='Modal' id='ModalMatchWaiting'>
        <div className='p-4 pb-1'>
          <header className='mb-3'>
            <h2>
              Waiting for opponent
            </h2>
          </header>
          <footer>
          </footer>
        </div>
      </div>
    );
  }
}

export default ModalMatchWaiting;
