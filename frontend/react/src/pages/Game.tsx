import { Component } from 'react';
import { socket, WebsocketProvider, WebsocketContext } from '../contexts/WebSocketContextGame';
import Request from "../components/utils/Requests"
// import Menu from '../components/Menu'
import '../styles/pages/game.css'
import ModalMatchWaiting from '../components/utils/ModalMatchWaiting';

let gameOver = () => {
  // PRINT WIN & Redirect ==============================
	socket.off('player2')
  socket.off('ballMoved')
  socket.off('userJoinChannel')
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
  console.log("1")
  if (settings.spec === false) {
  console.log("2")
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
  // console.log('spec', settings.spec, 'admin', settings.admin)
	// if ()
	// 	socket.emit('Ball', {})


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
    settings.end = 1
  }
  if (settings.ballPos[0] - settings.sizeBall > globale.width) {
    settings.end = 1
  }
}
  print(ctx, newPos, settings)
  if (settings.admin) {
    socket.emit('moveBall', {"room": settings.room, "ballPos": [settings.ballPos[0] / settings.w, settings.ballPos[1] / settings.h]}/* {"room": settings.room, "ballPos": [settings.ballPos[0] / settings.w, settings.ballPos[1] / settings.h]} */)
  }
  if (!settings.end) {
    window.requestAnimationFrame(() => {
      moveBall(ctx, globale, settings)
    })
    
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

  //moveBall(ctx, globale, settings)

  // let modal = document.getElementById("ModalMatchWaiting") as HTMLDivElement;
	// modal.classList.remove('hidden');

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
  }
	// if (url === currentUser.user.username)
	// 	settings.admin = true

  setTimeout(() => {init(ctx, globale, settings)}, 1000)
}

let startGame = (ctx: any, globale: any) => {
  if (settings.gameStarted === false) {
    settings.gameStarted = true;
    let countdown = setInterval(() => {
      console.log('Game start in ' + settings.timer + '...');
      settings.timer--;
      if (settings.timer === -1) {
        let modal = document.getElementById("ModalMatchWaiting") as HTMLDivElement;
        modal.classList.add("hidden")
        moveBall(ctx, globale, settings)
        clearInterval(countdown);
      }
    }, 1000);
  }
}

let joinRoom = (game: any, ctx: any, globale: any) => {
  let currentUser:any = sessionStorage.getItem('data');
  currentUser = JSON.parse(currentUser);
  // console.log("join room ", game);
  socket.emit('joinRoom', {"game":game, "auth_id": currentUser.user.auth_id})
  if (game.p1 === null || game.p1 === currentUser.user.auth_id) {
    settings.admin = true;
    console.log('IM THE ADMIN')
  }
  if ((game.p1 && game.p1 === currentUser.user.auth_id) || (game.p2 && game.p2 === currentUser.user.auth_id) || !game.p1 || !game.p2)
    settings.spec = false
  socket.on('userJoinChannel', (game:any) => {
    // let modal:any;
    // console.log("lets go")
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


class Game extends Component<{},{ w:number, h: number}> {
  constructor(props: any)
  {
    super(props)
    this.state = {
      w: 0,
      h: 0
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
    setSettings()
  }

 

  render() {
		//document.addEventListener('hashchange', (event) => {this.joinUrl()})
    window.onresize = () => {window.location.reload()}
    return (
      <div>
        <div className="canvas" id="canvas">
          <canvas ref="globale" id="globale" width={this.state.w} height={this.state.h}></canvas>
          <ModalMatchWaiting title="Create new game" calledBy="newGame" />
        </div>
      </div>
    );
  }
}

export default Game;
