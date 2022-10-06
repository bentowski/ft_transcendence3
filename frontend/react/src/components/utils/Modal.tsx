import { Component } from 'react';
import "../../styles/utils/modal.css";

class Modal extends Component<{ title: string, calledBy: string }, {}> {

  hidden = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.add('hidden')
  }

  printer = () => {
    switch (this.props.calledBy) {
      case "Avatar":
        return (
          <div className='p-4 pb-1'>
            <header className='p-1 mb-3'>
              <h2>{this.props.title}</h2>
            </header>
            <form>
             <input type="text" placeholder='new user name'></input>
            </form>
            <footer>
              <button className='mx-1' onClick={this.hidden}>Cancel</button>
              <button className='mx-1'>Change</button>
            </footer>
          </div>
        );
      case "Login":
        return (
          <div className='p-4 pb-1'>
            <header className='mb-3'>
              <h2>{this.props.title}</h2>
            </header>
            <form className='mb-3'>
              <input type="text" placeholder='new user name'></input>
            </form>
            <footer>
              <button className='mx-1' onClick={this.hidden}>Cancel</button>
              <button className='mx-1'>Change</button>
            </footer>
          </div>
        );
      case "newChan":
        return (
          <div className='p-4 pb-1'>
            <header className='mb-3'>
              <h2>{this.props.title}</h2>
            </header>
            <form className='mb-3'>
              <p>
                <input type="radio" name="chanType" value="public" id="public" />Public<br />
                <input type="radio" name="chanType" value="private" id="private" />Private<br />
                <input type="radio" name="chanType" value="protected" id="protected" />Protected<br />
                <input type="text" placeholder='name'></input><br />
                <input type="text" placeholder='topic'></input><br />
                <input type="text" placeholder='password'></input><br />
              </p>
            </form>
            <footer>
              <button className='mx-1' onClick={this.hidden}>Cancel</button>
              <button className='mx-1'>Create</button>
            </footer>
          </div>
        );
        case "addUser":
          return (
            <div className='p-4 pb-1'>
              <header className='mb-3'>
                <h2>{this.props.title}</h2>
              </header>
              <form className='mb-3'>
                <p>
                </p>
              </form>
              <footer>
                <button className='mx-1' onClick={this.hidden}>Cancel</button>
                <button className='mx-1'>Add</button>
              </footer>
            </div>
          );
    }
  }

  render() {
    return (
      <div className='Modal hidden' id='Modal'>
        {this.printer()}
      </div>
    );
  }
}

export default Modal;
