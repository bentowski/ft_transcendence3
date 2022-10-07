import React, { Component } from 'react';
import "../../styles/utils/modal.css";
import Request from "./Requests"

class Modal extends Component<{ title: string, calledBy: string}, {}> {

  hidden = () => {
    let modal = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.add('hidden')
    const login = document.getElementById('changeLogin') as HTMLInputElement
    login.value = ""
  }

  sendRequest = async () => {
    let newUser:any = sessionStorage.getItem('data');
    newUser = JSON.parse(newUser);
    const login = document.getElementById('changeLogin') as HTMLInputElement
    let ret = await Request(
                        'PATCH',
                        {
                          Accept: 'application/json',
                          'Content-Type': 'application/json'
                        },
                        {
                          "username": login.value,
                          "avatar" : newUser.user.avatar
                        },
                        "http://localhost:3000/user/settings/" + newUser.user.auth_id
                      )

    if (!ret.ok)
    {
      window.location.href = "/#" + login.value
      login.value = ""
      this.hidden()
    }
    let loginError = document.getElementById("loginError") as HTMLDivElement;
    loginError.classList.remove('hidden')
    setTimeout(() => {
      let loginError = document.getElementById("loginError") as HTMLDivElement;
      loginError.classList.add('hidden')
    }, 1700);

  }

  openWin = () => {
    var input = document.createElement('input');
    input.type = 'file';
    input.click();
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
              <button className='mx-1'>Change</button>
              <button className='mx-1' onClick={this.hidden}>Cancel</button>
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
              <input type="text" placeholder='new user name' id="changeLogin"></input>
              <p className="hidden" id="loginError">This login is not good</p>
            </form>
            <footer>
              <button className='mx-1' onClick={this.hidden}>Cancel</button>
              <button className='mx-1' onClick={this.sendRequest}>Change</button>
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
