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

const printNumber = (ctx: any, number: any) => {
  console.log(number)
}

const printGame = (ctx: any) => {
	let y = 0;
  if (settings.spec === false) {
    let move = 0;
      if (settings.up == 1)  {
        movePlayer(ctx, -1, settings)
        move += 1;
      }
      if (settings.down == 1) {
        movePlayer(ctx, 1, settings)
        move += 1;
      }
      if (move === 1) {
        socket.emit('barMove', {"ratio": (settings.player1[1] / settings.h), "p1": settings.p1, "p2": settings.p2, "player": settings.currentUser, "room": settings.room})
      }
    }
  ctx.clearRect(0, 0, settings.w, settings.h)
  while (y <= settings.h) {
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
  socket.emit("pleaseBall", settings.room)
	window.requestAnimationFrame(() => {
		printGame(ctx)
	})
  // settings.ballPos = [settings.ballPos[0] + (settings.vector[0] * settings.speed), settings.ballPos[1] + (settings.vector[1]  * settings.speed)]
	// if (settings.ballPos[0] < 0)
  // 	settings.ballPos[0] = 1;
  // if (settings.ballPos[0] > settings.w)
  // 	settings.ballPos[0] = settings.w - 1;
}

let movePlayer = (ctx: any, move: number, settings: any) => {
    let newPos = settings.player1[1] + (move * settings.playerSpeed)
    if (newPos > 0 && newPos < settings.h - settings.playerSize)
      settings.player1 = [settings.player1[0], newPos]
}

const start = (ctx: any) => {
	socket.off('Start')
	socket.on('moveBall', (ball, round) => {
    console.log("moveBall")
	    if (ball.room === settings.room)
			{
				settings.ballPos[0] = ball.ballPos[0] * settings.w;
				settings.ballPos[1] = ball.ballPos[1] * settings.h;
			}
	  })
		socket.on('players', (infos) => {
      console.log("players")
	    if (infos.room !== settings.room)
	      return ;
      console.log(settings.currentUser, infos.player)
			 if (infos.player !== settings.currentUser) {
         console.log(settings.spec, infos.admin)
	      if (settings.spec && infos.admin)
          settings.player1 = [settings.player1[0], infos.ratio * settings.h]
	      else
          settings.player2 = [settings.player2[0], infos.ratio * settings.h]
	     }
		})
	  socket.on('onEndGame', (room) => {
      console.log("onEndGame")
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
  p1: {},
  p2: {},
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
    p1: serv.p1,
    p2: serv.p2,
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
	socket.off('Init')
  initSettings(servSettings)
	const globale = document.getElementById('globale') as HTMLCanvasElement
  const ctx: any = globale.getContext('2d')
  printGame(ctx)
	socket.on('printCountDown', (room) => {
    if (room.room.id === settings.room)
    {
      if ((room.p1 && room.p1 === settings.currentUser) || (room.p2 && room.p2 === settings.currentUser) || !room.p1 || !room.p2)
      	settings.spec = false
      printNumber(ctx, room.number);
    }
	})
	socket.on('Start', (room) => {
    socket.off('printCountDown')
    if (room.room.id == settings.room)
      start(ctx)
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
		socket.off('userJoinChannel')
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
			if (body.room.id === settings.room)
        init(body.settings);
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
