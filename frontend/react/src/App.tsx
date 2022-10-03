import React from 'react';
import './styles/App.css';
import Game from './pages/Game'
import Page from './pages/Page'
// import Login from './pages/Login'

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
