import {Component} from 'react';

class Messages extends Component<{value : number}, {}> {
  renderMessage(origin: string, x: number) {
    if (origin == "own")
    {
      return (
        <div key={x} className="row">
          <div className="left col-6">
          </div>
          <div className="rigth col-6">
            <p>messages own</p>
          </div>
        </div>
      )
    }
    else
    {
      return (
        <div key={x} className="row">
          <div className="left col-6">
            <p>messages others</p>
          </div>
          <div className="rigth col-6">
          </div>
        </div>
      )
    }
  }


  render() {
    let x = 0;
    let origin = "";
    const items = [];
    while (x < this.props.value)
    {
      if (x % 3)
        origin = "other";
      else
        origin = "own";
      items.push(this.renderMessage(origin, x))
      x++;
    }
    return (
      <div className="row">
        {items}
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default Messages;
