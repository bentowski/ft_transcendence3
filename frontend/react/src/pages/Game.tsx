import { Component, createRef } from 'react';
import { useNavigate } from "react-router-dom";
import { socket, WebsocketProvider, WebsocketContext } from '../contexts/WebSocketContextGame';
import Request from "../components/utils/Requests"
import '../styles/pages/game.css'
import ModalMatchWaiting from '../components/utils/ModalMatchWaiting';
import { io } from 'socket.io-client';
import { UserType } from "../types"
import { AuthContext } from '../contexts/AuthProviderContext';
const updateSocket = io("http://localhost:3000/update");

// let moveBall = (ctx: any, globale: any, settings: any) => {
//   let newPos: number = settings.ballPos[1]
//   ctx.clearRect(0, 0, globale.width, globale.height)
//   if (settings.admin) {
//     if (settings.ballPos[1] + (settings.sizeBall / 2) >= globale.height) {
//       newPos = globale.height - (settings.sizeBall / 2)
//       settings.vector = [settings.vector[0], -settings.vector[1]]
//       settings.ballPos = [settings.ballPos[0], newPos]
//     }
//     if (settings.ballPos[1] - (settings.sizeBall / 2) < 0) {
//       newPos = (0 + (settings.sizeBall / 2))
//       settings.vector = [settings.vector[0], -settings.vector[1]]
//       settings.ballPos = [settings.ballPos[0], newPos]
//     }
//   }
//   // =========== Players moves ==========
//   if (settings.spec === false) {
//   let move = 0;
//     if (settings.up == 1)  {
//       movePlayer(ctx, -1, globale, settings)
//       move += 1;
//     }
//     if (settings.down == 1) {
//       movePlayer(ctx, 1, globale, settings)
//       move += 1;
//     }
//     if (move === 1) {
//       socket.emit('barMove', {"ratio": (settings.player1[1] / settings.h), "player": settings.currentUser.auth_id, "fromAdmin": settings.admin, "room": settings.room})
//     }
//   }
//   // ============== End Players Moves ===============
//   if (settings.admin) {
//   	if (settings.ballPos[0] + settings.sizeBall / 2 > settings.player1[0]) {
// 			if (settings.ballPos[1] >= settings.player1[1] && settings.ballPos[1] <= settings.player1[1] + settings.sizeBall * 4) {
// 				let percent = Math.floor((settings.ballPos[1] - settings.player1[1]) / ((settings.player1[1] + settings.sizeBall * 4) - settings.player1[1]) * 100)
// 				if (percent <= 20) {
// 					settings.vector = [-0.5, -Math.sqrt(3) / 2];
// 				}
// 				else if (percent <= 40) {
// 					settings.vector = [-Math.sqrt(3) / 2, -0.5];
// 				}
// 				else if (percent <= 60) {
// 					settings.vector = [-1, 0];
// 				}
// 				else if (percent <= 80) {
// 					settings.vector = [-Math.sqrt(3) / 2, 0.5];
// 				}
// 				else {
// 					settings.vector = [-0.5, Math.sqrt(3) / 2];
// 				}
// 			}
// 			else {
// 				settings.nextRound = 1
// 				// settings.ballPos = [settings.w / 2, settings.h / 2]
// 				// settings.speed = settings.baseSpeed
// 				// settings.round++;
// 				//! give point to p1
// 			}
//   	}
//   	if (settings.ballPos[0] < settings.player2[0] + settings.sizeBall * 1.5)
//   	{
// 		if (settings.ballPos[1] >= settings.player2[1] && settings.ballPos[1] <= settings.player2[1] + settings.sizeBall * 4) {
// 			let percent = Math.floor((settings.ballPos[1] - settings.player2[1]) / ((settings.player2[1] + settings.sizeBall * 4) - settings.player2[1]) * 100)
// 			if (percent <= 20) {
// 				settings.vector = [0.5, -Math.sqrt(3) / 2];
// 			}
// 			else if (percent <= 40) {
// 				settings.vector = [Math.sqrt(3) / 2, -0.5];
// 			}
// 			else if (percent <= 60) {
// 				settings.vector = [1, 0];
// 			}
// 			else if (percent <= 80) {
// 				settings.vector = [Math.sqrt(3) / 2, 0.5];
// 			}
// 			else {
// 				settings.vector = [0.5, Math.sqrt(3) / 2];
// 			}
// 		}
// 		else {
// 			settings.nextRound = 1
//
// 			//! give point to p2
// 		}
//     	settings.speed++;
//   	}
// 	}
// 	if (settings.round < 3)
// 	{
// 		if (settings.nextRound == 0)
// 		{
// 			if (settings.admin)
// 				socket.emit('moveBall', {"room": settings.room, "ballPos": [settings.ballPos[0] / settings.w, settings.ballPos[1] / settings.h], "round": settings.round})
// 			print(ctx, newPos, settings)
// 			window.requestAnimationFrame(() => {
// 				moveBall(ctx, globale, settings)
// 			})
// 		} else {
// 			settings.ballPos = [settings.w / 2, settings.h / 2]
// 			settings.speed = settings.baseSpeed
// 			settings.round++;
// 			settings.nextRound = 0;
// 			if (settings.admin)
// 				socket.emit('moveBall', {"room": settings.room, "ballPos": [settings.ballPos[0] / settings.w, settings.ballPos[1] / settings.h], "round": settings.round})
// 			print(ctx, newPos, settings)
// 			setTimeout( () => {
// 				window.requestAnimationFrame(() => {
// 					moveBall(ctx, globale, settings)
// 				})
// 			}, 3000)
// 		}
// 	}
// 	else
// 	{
//     socket.emit('endGame', settings.room)
// 		gameOver()
// 	}
// }


// let setSettings = () => {
//   //===============interaction=================
//   const globale = document.getElementById('globale') as HTMLCanvasElement
//   const ctx: any = globale.getContext('2d')
//
// 	// let currentUser:any = sessionStorage.getItem('data');
// 	// currentUser = JSON.parse(currentUser);
//   let element = document.body as HTMLDivElement,
//   winWidth: number = element.clientWidth,
//   winHeight: number = element.clientHeight
// 	let url = document.URL
// 	url = url.substring(url.lastIndexOf("/") + 1)
//   if ((winWidth * 19) / 26 > winHeight)
//     winWidth = ((winHeight * 26) / 19)
//   else
//     winHeight = ((winWidth * 19) / 26)
//   settings = {
//     w: winWidth,
//     h: winHeight,
//     nbPlayer: settings.nbPlayer,
//     playerHighStart: winHeight / 2 + (winHeight / 25),
//     playerSize: (winHeight / 30) * 4,
// 		p1Name: settings.p1Name,
// 		p2Name: settings.p2Name,
// 		player1: [winWidth - winHeight / 20, (winHeight / 2) - (winHeight / 15)],
//     player2: [0 + winHeight / 20 - winHeight / 30, (winHeight / 2) - (winHeight / 15)],
//     playerSpeed: 10,
//     sizeBall:  winHeight / 30,
//     ballPos: [winWidth / 2, winHeight / 2],
//     vector: [1, 0],
// 		baseSpeed: settings.baseSpeed,
//     speed: settings.baseSpeed,
//     middle: winWidth / 2,
//     end: 0,
//     move: 0,
// 		currentUser: settings.currentUser,
//     spec: true,
//     admin: false,
//     room: url,
//     gameStarted: settings.gameStarted,
//     timer: settings.timer,
// 		callback: settings.callback,
// 		round: settings.round,
// 		nextRound: settings.nextRound,
// 		isLoaded: settings.isLoaded
//   }
//   setTimeout(() => {init(ctx, globale, settings)}, 1000)
// }
//

let gameOver = () => {
  socket.off('ballMoved')
	socket.off('players')
  socket.off('onEndGame')
	window.location.href = "http://localhost:8080/profil"
}

let joinRoom = async () => {
  const games = await Request('GET', {}, {}, "http://localhost:3000/parties")
  let url = document.URL
  let index = url.lastIndexOf("/")
  if (index === -1) {
    window.location.href = "http://localhost:8080/profil"
  }
  else {
    url = url.substring(index + 1)
    let game: any = games.find((c:any) => c.id === url)
    if (game === undefined) {
      window.location.href = "http://localhost:8080/profil"
    }
    else
			socket.emit('joinRoom', {"game":game, "auth_id": settings.currentUser})
  }
}

// const changeSize = () => {
// 	let oldWidth = settings.w
// 	let oldHeight = settings.h
// 	let element = document.body as HTMLDivElement;
// 	let newWidth = element.clientWidth
// 	let newHeight = element.clientHeight
// 	let newRatio = newWidth / oldWidth
// 	settings = {
// 		w: newWidth,
// 		h: newHeight,
// 		currentUser: settings.currentUser,
// 		room: settings.room,
// 		ballPos: [(settings.ballPos[0] * newWidth) / oldWidth, (settings.ballPos[1] * newWidth) / oldWidth],
// 		player1: [(settings.player1[0] * newWidth) / oldWidth, (settings.player1[1] * newWidth) / oldWidth],
// 		player2: [(settings.player2[0] * newWidth) / oldWidth, (settings.player2[1] * newWidth) / oldWidth],
// 		middle: newWidth / 2,
// 		sizeBall:  newHeight / 30,
// 		playerSize: (newHeight / 30) * 4,
// 	}
// }

const printNumber = (ctx: any, globale: any) => {

}

const printGame = (ctx: any) => {
	let y = 0;
  console.log("Settings Printable : ", settings)
  while (y < settings.h) {
    ctx.fillStyle = "white"
    ctx.fillRect(settings.middle - settings.sizeBall / 2, y - settings.sizeBall / 2, settings.sizeBall / 10, settings.sizeBall)
    y += settings.sizeBall * 2
  }
  ctx.fillStyle = "white"
  ctx.fillRect(settings.player2[0], settings.player2[1], settings.sizeBall, settings.playerSize)
  ctx.fillStyle = "white"
  ctx.fillRect(settings.player1[0], settings.player1[1], settings.sizeBall, settings.playerSize)
	ctx.fillStyle = "white"
	ctx.beginPath();
	ctx.fillRect(settings.ballPos[0], settings.ballPos[1], settings.sizeBall, settings.sizeBall)
	ctx.fill()
	ctx.closePath();
	// window.requestAnimationFrame(() => {
	// 	printGame(ctx, globale)
	// })
  // settings.ballPos = [settings.ballPos[0] + (settings.vector[0] * settings.speed), settings.ballPos[1] + (settings.vector[1]  * settings.speed)]
	// if (settings.ballPos[0] < 0)
  // 	settings.ballPos[0] = 1;
  // if (settings.ballPos[0] > settings.w)
  // 	settings.ballPos[0] = settings.w - 1;
}

let movePlayer = (ctx: any, move: number, globale: any, settings: any) => {
    let newPos = settings.player1[1] + (move * settings.playerSpeed)
    if (newPos > 0 && newPos < settings.h - settings.playerSize) {
      settings.player1 = [settings.player1[0], newPos]
      ctx.clearRect(settings.player1[0] - 1, 0, settings.sizeBall + 2, globale.height);
      ctx.fillStyle = "white"
      ctx.fillRect(settings.player1[0], newPos, settings.sizeBall, settings.sizeBall * 4)
    }
}

let movePlayer1 = (ctx: any, globale: any, position: number, settings: any) => {
  let newPos = position
  settings.player1 = [settings.player1[0], newPos]
  // ctx.clearRect(settings.player1[0] - 1, 0, settings.sizeBall + 2, globale.height);
  // ctx.fillStyle = "white"
  // ctx.fillRect(settings.player1[0], newPos, settings.sizeBall, settings.playerSize)
}

let movePlayer2 = (ctx: any, globale: any, position: number, settings: any) => {
    let newPos = position
    settings.player2 = [settings.player2[0], newPos]
    // ctx.clearRect(settings.player2[0] - 1, 0, settings.sizeBall + 2, globale.height);
    // ctx.fillStyle = "white"
    // ctx.fillRect(settings.player2[0], newPos, settings.sizeBall, settings.playerSize)
}

const start = (ctx: any, globale: any) => {
	socket.off('Start')
	socket.on('pleaseBall', (ball, round) => {
	    if (ball.room === settings.room)
			{
				settings.ballPos[0] = ball.ballPos[0] * settings.w;
				settings.ballPos[1] = ball.ballPos[1] * settings.h;
			}
	  })
		socket.on('players', (infos) => {
	    if (infos.room !== settings.room)
	      return ;
			 if (infos.player !== settings.currentUser) {
	      if (settings.spec && infos.fromAdmin)
	        movePlayer1(ctx, globale, infos.ratio * settings.h, settings)
	      else
				  movePlayer2(ctx, globale, infos.ratio * settings.h, settings)
	     }
		})
	  socket.on('onEndGame', (room) => {
	    if (room === settings.room)
	      gameOver();
	  })
}


let settings = {
  w: 0,
  h: 0,
	currentUser: 0,
	room: '',
  spec: true,
  up: 0,
  down: 0,
	ballPos: [0, 0],
	player1: [0, 0],
	player2: [0, 0],
  sizeBall: 0,
	playerSize: 0,
  playerSpeed: 0,
  middle: 0,
  p1Score: 0,
  p2Score: 0
}


const initSettings = (serv: any) => {
  settings = {
    w: settings.w,
    h: settings.h,
    currentUser: settings.currentUser,
    room: settings.room,
    spec: settings.spec,
    up: settings.up,
    down: settings.down,
    ballPos: [serv.ballPos[0] * settings.w / 100, serv.ballPos[1] * settings.h / 100],
    player1: [serv.player1[0] * settings.w / 100, serv.player1[1] * settings.h / 100],
    player2: [serv.player2[0] * settings.w / 100, serv.player2[1] * settings.h / 100],
    sizeBall: serv.sizeBall * settings.h / 100,
    playerSize: serv.playerSize * settings.h / 100,
    playerSpeed: serv.playerSize,
    middle: serv.middle * settings.w / 100,
    p1Score: serv.p1Score,
    p2Score: serv.p2Score
  }
}

// Change type to SettingType
const init = (servSettings: any) => {
  console.log("Settings3: ", servSettings)
	// console.log(settings)
	socket.off('Init')
  initSettings(servSettings)
	const globale = document.getElementById('globale') as HTMLCanvasElement
  const ctx: any = globale.getContext('2d')
  // ctx.clearRect(0, 0, globale.width, globale.height)
  printGame(ctx)
	socket.on('printCountDown', (number) => {
		printNumber(ctx, globale);
	})
	socket.on('Start', () => {
		socket.off('printCountDown')
		start(ctx, globale)
	})
  let infosClavier = (e: KeyboardEvent) => {
    let number = Number(e.keyCode);
      switch (number) {
        case 38:
          settings.up = 1;
          break;
        case 40:
          settings.down = 1;
          break;
        default:
    }
  }

  let infosClavier2 = (e: KeyboardEvent) => {
    let number = Number(e.keyCode);
      switch (number) {
        case 38:
          settings.up = 0;
          break;
        case 40:
          settings.down = 0;
          break;
        default:
    }
  }

  document.addEventListener("keydown", infosClavier);
  document.addEventListener("keyup", infosClavier2);
}

const justwait = () => {
	socket.on('Init', (body) => {
    // console.log("Settings2: ", settings)
		socket.off('userJoinChannel')
		// console.log("Settings: ", body.settings)
		let modal = document.getElementById("ModalMatchWaiting") as HTMLDivElement;
		modal.classList.add("hidden")
		if (body.room.id === settings.room)
			init(body.settings);
	})
}

class Game extends Component<{},{w:number, h: number, timer: number}> {
	static contextType = AuthContext;

	private globale: any = createRef()

  componentWillUnmount = () => {
		socket.off('userJoinChannel')
		socket.off('Init')
		socket.off('Start')
		socket.off('ballMoved')
		socket.off('userJoinChannel')
		socket.off('players')
		socket.off('onEndGame')
  }

//============ Settings game ===============
  componentDidMount = () => {
		const ctx: any = this.context;
    let element = document.body as HTMLDivElement;
    let winWidth = element.clientWidth;
    let winHeight = element.clientHeight;
    if ((winWidth * 19) / 26 > winHeight)
      winWidth = ((winHeight * 26) / 19)
    else
      winHeight = ((winWidth * 19) / 26)
    settings.w = winWidth
    settings.h = winHeight
	  settings.currentUser = ctx.user.auth_id;
    let url = document.URL
  	url = url.substring(url.lastIndexOf("/") + 1)
    settings.room = url
		joinRoom()
		socket.on('userJoinChannel', () => {
			socket.off('Init')
			justwait();
		})
		socket.on('Init', (body) => {
			socket.off('userJoinChannel')
			let modal = document.getElementById("ModalMatchWaiting") as HTMLDivElement;
			modal.classList.add("hidden")
			// console.log("Settings1: ", body.settings)
      // console.log(body.room, " : ", settings.room)
			if (body.room.id === settings.room)
      {
        init(body.settings);
      }
		})
  }

  render() {
    // window.onresize = () => {changeSize()}
    return (
      <div>
        <div className="canvas" id="canvas">
          <canvas ref={this.globale} id="globale" width={settings.w} height={settings.h}></canvas>
          <ModalMatchWaiting title="In wait for player" calledBy="newGame" />
        </div>
      </div>
    );
  }
}

export default Game;
