import { Component } from 'react';
import { socket, WebsocketProvider, WebsocketContext } from '../contexts/WebSocketContextGame';
import Request from "../components/utils/Requests"
// import Menu from '../components/Menu'
import '../styles/pages/game.css'
import ModalMatchWaiting from '../components/utils/ModalMatchWaiting';
import { io } from 'socket.io-client';

const updateSocket = io("http://localhost:3000/chat");

let gameOver = () => {
  // PRINT WIN & Redirect ==============================
	socket.off('player2')
  socket.off('ballMoved')
  socket.off('userJoinChannel')
	console.log("ARRRG")
	// window.location.href = "http://localhost:8080/profil"
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
  if (newPos > 0 && newPos < settings.h - settings.playerSize) {
    settings.player1 = [settings.player1[0], newPos]
    ctx.clearRect(settings.player1[0] - 1, 0, settings.sizeBall + 2, globale.height);
    ctx.fillStyle = "white"
    ctx.fillRect(settings.player1[0], newPos, settings.sizeBall, settings.sizeBall * 4)
  }
}

let movePlayer2 = (ctx: any, globale: any, position: number, settings: any) => {
    let newPos = position
    if (newPos > 0 && newPos < settings.h - settings.playerSize) {
      settings.player2 = [settings.player2[0], newPos]
      ctx.clearRect(settings.player2[0] - 1, 0, settings.sizeBall + 2, globale.height);
      ctx.fillStyle = "white"
      ctx.fillRect(settings.player2[0], newPos, settings.sizeBall, settings.sizeBall * 4)
    }
}


let print = (ctx: any, newPos: number, settings: any) => {
  let y = 0;

  while (y < settings.h) {
    ctx.fillStyle = "white"
    ctx.fillRect(settings.middle, y, settings.sizeBall / 10, settings.sizeBall)
    y += settings.sizeBall * 2
  }
  ctx.fillStyle = "white"
  ctx.fillRect(settings.player2[0], settings.player2[1], settings.sizeBall, settings.sizeBall * 4)
  ctx.fillStyle = "white"
  ctx.fillRect(settings.player1[0], settings.player1[1], settings.sizeBall, settings.sizeBall * 4)
  settings.ballPos = [settings.ballPos[0] + (settings.vector[0] * settings.speed), settings.ballPos[1] + (settings.vector[1]  * settings.speed)]
  ctx.fillStyle = "white"
  ctx.beginPath();
  ctx.fillRect(settings.ballPos[0], newPos, settings.sizeBall, settings.sizeBall)
  ctx.fill()
  ctx.closePath();
}

let moveBall = (ctx: any, globale: any, settings: any) => {
  let newPos: number = settings.ballPos[1]
  ctx.clearRect(0, 0, globale.width, globale.height)
  if (settings.admin) {
    if (settings.ballPos[1] + settings.sizeBall > globale.height) {
      newPos = globale.height - (settings.sizeBall)
      settings.vector = [settings.vector[0], -settings.vector[1]]
      settings.ballPos = [settings.ballPos[0], newPos]
    }
    if (settings.ballPos[1] < 0) {
      newPos = (0)
      settings.vector = [settings.vector[0], -settings.vector[1]]
      settings.ballPos = [settings.ballPos[0], newPos]
    }
  }
  // =========== Players moves ==========
  if (settings.spec === false) {
  let move = 0;
    if (settings.up == 1)  {
      movePlayer(ctx, -1, globale, settings)
      move += 1;
    }
    if (settings.down == 1) {
      movePlayer(ctx, 1, globale, settings)
      move += 1;
    }
    if (move === 1) {
      socket.emit('barMove', {"ratio": (settings.player1[1] / settings.h), "player": settings.currentUser.auth_id, "fromAdmin": settings.admin, "room": settings.room})
    }
  }

  // ============== End Players Moves ===============
  if (settings.admin) {
	  if (settings.ballPos[0] + settings.sizeBall >= settings.player1[0] && settings.ballPos[0] + settings.sizeBall < globale.width)
	  {
	    settings.vector = [-settings.vector[0], -1]
	    settings.speed++;
	  }
	  if (settings.ballPos[0] <= settings.player2[0] + settings.sizeBall)
	  {

	    settings.vector = [-settings.vector[0], settings.vector[1]]
	  }
	  if (settings.ballPos[0] <= 10 && settings.player1[1] < settings.ballPos[1] + settings.sizeBall && settings.ballPos[1] - settings.sizeBall < settings.player1[1] + 100) {
	  }
	  if (settings.ballPos[0] + settings.sizeBall < 0) {
	    settings.nextRound = 1
	  }
	  if (settings.ballPos[0] - settings.sizeBall > globale.width) {
	    settings.nextRound = 1
	  }
	}

	console.log(settings.nextRound)
	if (settings.nextRound == 0)
	{
		print(ctx, newPos, settings)
		if (settings.admin) {
			socket.emit('moveBall', {"room": settings.room, "ballPos": [settings.ballPos[0] / settings.w, settings.ballPos[1] / settings.h]}/* {"room": settings.room, "ballPos": [settings.ballPos[0] / settings.w, settings.ballPos[1] / settings.h]} */)
		}
		window.requestAnimationFrame(() => {
      moveBall(ctx, globale, settings)
    })
	}
	else if (settings.round < 3)
	{
		console.log("NEXTROUND")
		reSet()
		print(ctx, newPos, settings)
			window.requestAnimationFrame(() => {
				moveBall(ctx, globale, settings)
			})
	}
	else
	{
		gameOver();
	}
}

let init = (ctx: any, globale: any, settings: any) => {
  //======ligne centrale=========
  let y = 0;
  while (y < settings.h) {
    ctx.fillStyle = "white"
    ctx.fillRect(settings.middle, y, settings.sizeBall / 10, settings.sizeBall)
    y += settings.sizeBall * 2
  }
  //======joueurs========
  ctx.fillStyle = "white"
  ctx.fillRect(settings.player2[0], settings.player2[1], settings.sizeBall, settings.sizeBall * 4)
  ctx.fillStyle = "white"
  ctx.fillRect(settings.player1[0], settings.player1[1], settings.sizeBall, settings.sizeBall * 4)

  //========balle========
  ctx.fillStyle = "white"
  ctx.fillRect(settings.ballPos[0], settings.ballPos[1], settings.sizeBall, settings.sizeBall)
  ctx.fill()

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
  joinUrl(ctx, globale)
	socket.on('player2', (infos) => {
    if (infos.room !== settings.room)
      return ;
		 if (infos.player !== settings.currentUser.auth_id) {
      if (settings.spec && infos.fromAdmin)
        movePlayer1(ctx, globale, infos.ratio * settings.h, settings)
      else
			  movePlayer2(ctx, globale, infos.ratio * settings.h, settings)
     }
	})
  socket.on('ballMoved', (ball) => {
    if (ball.room !== settings.room)
      return ;
    if (!settings.admin && !settings.spec) {
      settings.ballPos[0] = (1 - ball.ballPos[0]) * settings.w;
      settings.ballPos[1] = (ball.ballPos[1]) * settings.h;
    }
    else {
      settings.ballPos[0] = ball.ballPos[0] * settings.w;
      settings.ballPos[1] = ball.ballPos[1] * settings.h;
    }
    ctx.clearRect(0, 0, globale.width, globale.height)
    print(ctx, settings.ballPos[1], settings)
  })
}

let settings = {
  w: 0,
  h: 0,
  nbPlayer: 1,
  playerHighStart: 0,
  playerSize: 0,
  player1: [0, 0],
  player2: [0, 0],
  playerSpeed: 0,
  sizeBall: 0,
  ballPos: [0, 0],
  vector: [0, 0],
  speed: 0,
  middle: 0,
  end: 0,
  move: 0,
  currentUser: {},
  spec: true,
  admin: false,
  room: '',
  gameStarted: false,
  timer: 5,
  callback: (countdown: number) => {},
	round: 0,
	nextRound: 0
}

let reSet = () => {
	settings = {
		w: settings.w,
		h: settings.h,
		nbPlayer: settings.nbPlayer,
		playerHighStart: settings.playerHighStart,
		playerSize: settings.playerSize,
		player1: settings.player1,
		player2: settings.player2,
		playerSpeed: settings.playerSpeed,
		sizeBall:  settings.sizeBall,
		ballPos: [settings.w / 2, settings.h / 2],
		vector: [1, 1],
		speed: 4,
		middle: settings.middle,
		end: settings.end,
		move: settings.move,
		currentUser: settings.currentUser,
		spec: settings.spec,
		admin: settings.admin,
		room: settings.room,
		gameStarted: settings.gameStarted,
		timer: settings.timer,
		callback: settings.callback,
		round: settings.round + 1,
		nextRound: 0
	}
}

let setSettings = () => {
  //===============interaction=================
  const globale = document.getElementById('globale') as HTMLCanvasElement
  const ctx: any = globale.getContext('2d')

	let currentUser:any = sessionStorage.getItem('data');
	currentUser = JSON.parse(currentUser);
  let element = document.body as HTMLDivElement,
  winWidth: number = element.clientWidth,
  winHeight: number = element.clientHeight
	let url = document.URL
	url = url.substring(url.lastIndexOf("/") + 1)
  if ((winWidth * 19) / 26 > winHeight)
    winWidth = ((winHeight * 26) / 19)
  else
    winHeight = ((winWidth * 19) / 26)
  settings = {
    w: winWidth,
    h: winHeight,
    nbPlayer: 1,
    playerHighStart: winHeight / 2 + (winHeight / 25),
    playerSize: (winHeight / 30) * 4,
    player1: [winWidth - winHeight / 20, (winHeight / 2) - (winHeight / 25)],
    player2: [0, (winHeight / 2) - (winHeight / 25)],
    playerSpeed: 20,
    sizeBall:  winHeight / 30,
    ballPos: [winWidth / 2, winHeight / 2],
    vector: [1, 1],
    speed: 4,
    middle: winWidth / 2,
    end: 0,
    move: 0,
		currentUser: currentUser.user,
    spec: true,
    admin: settings.admin,
    room: url,
    gameStarted: settings.gameStarted,
    timer: settings.timer,
		callback: settings.callback,
		round: settings.round,
		nextRound: settings.nextRound
  }
  setTimeout(() => {init(ctx, globale, settings)}, 1000)
}

let startGame = (ctx: any, globale: any) => {
  if (settings.gameStarted === false && settings.spec === false) {
    settings.gameStarted = true;
    let countdown = setInterval(() => {
      console.log('Game start in ' + settings.timer + '...');
      settings.timer--;
	  settings.callback(settings.timer)
      if (settings.timer === -1) {
        let modal = document.getElementById("ModalMatchWaiting") as HTMLDivElement;
        modal.classList.add("hidden")
        moveBall(ctx, globale, settings)
        clearInterval(countdown);
      }
    }, 1000);
  }
  else if (settings.gameStarted === false && settings.spec === true) {
	settings.gameStarted = true;
	settings.timer = -1;
	let modal = document.getElementById("ModalMatchWaiting") as HTMLDivElement;
    modal.classList.add("hidden")
    moveBall(ctx, globale, settings)
  }
}

let joinRoom = (game: any, ctx: any, globale: any) => {
  let currentUser:any = sessionStorage.getItem('data');
  currentUser = JSON.parse(currentUser);
  socket.emit('joinRoom', {"game":game, "auth_id": currentUser.user.auth_id})
  if (game.p1 === null || game.p1 === currentUser.user.auth_id) {
    settings.admin = true;
  }
  if ((game.p1 && game.p1 === currentUser.user.auth_id) || (game.p2 && game.p2 === currentUser.user.auth_id) || !game.p1 || !game.p2)
    settings.spec = false
  socket.on('userJoinChannel', (game:any) => {
    console.log(game)
    if (game.id === settings.room) {
      if (game.p1 !== null && game.p2 !== null) {
        startGame(ctx, globale);
      }
    }
  })
}

let joinUrl = async (ctx: any, globale: any) => {
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
      joinRoom(game, ctx, globale)
  }
}


class Game extends Component<{},{ w:number, h: number, timer: number}> {
  constructor(props: any)
  {
    super(props)
    this.state = {
      w: 0,
      h: 0,
	  timer: 0,
    }
  }

  componentWillUnmount = () => {
    gameOver();
  }

//============ Settings game ===============
  componentDidMount = () => {
    let element = document.body as HTMLDivElement;
    let winWidth = element.clientWidth
    let winHeight = element.clientHeight
    if ((winWidth * 19) / 26 > winHeight)
      winWidth = ((winHeight * 26) / 19)
    else
      winHeight = ((winWidth * 19) / 26)
    this.setState({
        w : winWidth,
        h: winHeight,
      })
	settings.callback = this.updateState;
    setSettings()
  }

  updateState = (countdown: number) => {
	this.setState({timer: countdown})
  }

  modalCountDown = () => {
	if (settings.gameStarted === true && settings.timer >= 0)
		return (<ModalMatchWaiting title="Create new game" calledBy="newGame" countdown={settings.timer}/>)
	else
		return (<ModalMatchWaiting title="Create new game" calledBy="newGame" />)
  }

  render() {
    window.onresize = () => {window.location.reload()}
    return (
      <div>
        <div className="canvas" id="canvas">
          <canvas ref="globale" id="globale" width={this.state.w} height={this.state.h}></canvas>
          {this.modalCountDown()}
        </div>
      </div>
    );
  }
}

export default Game;
