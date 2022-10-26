import React, { Component } from 'react';
import '../../styles/components/utils/historyCards.css'
// import Request from "./Requests"

class HistoryCards extends Component<{ history: any, profil: string }, {}> {

  renderStatus = (user: boolean) => {
    // let status: string = "";
    if (!user) {
      if (this.props.history.score_one > this.props.history.score_two)
        return (
          <div className='Winner'>winner</div>
        );
      else if (this.props.history.score_one < this.props.history.score_two)
        return (
          <div className='Looser'>looser</div>
        );
    }
    else {
      if (this.props.history.score_one < this.props.history.score_two)
        return (
          <div className='Winner'>winner</div>
        );
      else if (this.props.history.score_one > this.props.history.score_two)
        return (
          <div className='Looser'>looser</div>
        );
    }
    return (
      <div></div>
    );
  }

  renderHistoryCards = () => {
    let status_one: any = this.renderStatus(false);
    let status_two: any = this.renderStatus(true);
    if (this.props.profil) {
      if (this.props.profil === this.props.history.user_one)
        return (
          <div className='historyDiv m-0 p-0 my-2 d-flex flex-row justify-content-between'>
            <div className='col-4 d-flex flex-row justify-content-start'>{status_one}</div>
            <div className='col-4 d-flex flex-row justify-content-center'>
              <div className='col-5 d-flex flex-row justify-content-end'>{this.props.history.score_one}</div>
              <div className='col-2 d-flex flex-row justify-content-center'> | </div>
              <div className='col-5 d-flex flex-row justify-content-start'>{this.props.history.score_two}</div>
            </div>
            <div className='col-4 d-flex flex-row justify-content-end'>
              <a className='mx-2' href={"/profil/#" + this.props.history.user_two}>{this.props.history.user_two}</a>
              <img src="avatar" alt="" className='miniAvatar' />
            </div>
          </div>
        )
      else {
        return (
          <div className='historyDiv m-0 p-0 my-2 d-flex flex-row justify-content-between'>
            <div className='col-4 d-flex flex-row justify-content-start'>{status_two}</div>
            <div className='col-4 d-flex flex-row justify-content-center'>
              <div className='col-5 d-flex flex-row justify-content-end'>{this.props.history.score_two}</div>
              <div className='col-2 d-flex flex-row justify-content-center'> | </div>
              <div className='col-5 d-flex flex-row justify-content-start'>{this.props.history.score_one}</div>
            </div>
            <div className='col-4 d-flex flex-row justify-content-end'>
              <a className='mx-2' href={"/profil/#" + this.props.history.user_one}>{this.props.history.user_one}</a>
              <img src="avatar" alt="" className='miniAvatar' />
            </div>
          </div>
        )
      }
    }
    else {
      return (
        <div className='historyDiv m-0 p-0 my-2 d-flex flex-row justify-content-between'>
          <div className='col-2 d-flex flex-row'>
            <img src="avatar" alt="" className='miniAvatar' />
            <a className='mx-2' href={"/profil/#" + this.props.history.user_one}>{this.props.history.user_one}</a>
          </div>
          <div className='col-2 d-flex flex-row justify-content-center'>{status_one}</div>
          <div className='col-4 d-flex flex-row justify-content-center'>
            <div className='col-5 d-flex flex-row justify-content-end'>{this.props.history.score_one}</div>
            <div className='col-2 d-flex flex-row justify-content-center'> | </div>
            <div className='col-5 d-flex flex-row justify-content-start'>{this.props.history.score_two}</div>
          </div>
          <div className='col-2 d-flex flex-row justify-content-center'>{status_two}</div>
          <div className='col-2 d-flex flex-row justify-content-end'>
            <a className='mx-2' href={"/profil/#" + this.props.history.user_two}>{this.props.history.user_two}</a>
            <img src="avatar" alt="" className='miniAvatar' />
          </div>
        </div>
      )
    }
  }

  render() {
    // console.log(this.props.history.user_one);
    let items: any = this.renderHistoryCards();
    return (
      <div>
        {items}
      </div>
    );
  }
}

export default HistoryCards;
