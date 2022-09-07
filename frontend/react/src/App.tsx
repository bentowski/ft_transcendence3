import React from 'react';
import './App.css';
import Game from './components/Game'
import Page from './components/Page'

class App extends React.Component {
  state = {
    printing : "login",
  }

  game = () => {
    this.setState({printing : "game"})
  };

  clear = () => {
  	this.setState({printing : ""})
  }



  render() {
    let printer = null
	let printing = this.state.printing

	switch (printing) {
		// case "login":
		// 	printer = (
		// 		<Login />
		// 	)
		// break;

		case "game":
			printer = (
				<Game />
			)
		break;

		default:
			printer = (
        // <div className="App">
				    <Page />
        // </div>
			)
	}

    return (
      <div className="App">
	  	  {printer}
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default App;
