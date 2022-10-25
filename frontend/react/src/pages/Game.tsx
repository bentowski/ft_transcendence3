import { Component } from 'react';
// import Menu from '../components/Menu'
import '../styles/components/game.css'

let gameOver = () => {
  // PRINT WIN & Redirect ==============================
  // window.location.href = "http://localhost:8080/profil"
}

let movePlayer = (ctx: any, move: number, globale: any, currentPlayer: number, settings: any) => {
  if (currentPlayer == 1)
  {
    let newPos = settings.player1[1] + (move * settings.playerSpeed)
    if (newPos > 0 && newPos < settings.h - settings.playerSize) {
      settings.player1 = [settings.player1[0], newPos]
      settings.speed = settings.speed + 0.1
      ctx.clearRect(settings.player1[0] - 1, 0, settings.sizeBall + 2, globale.height);
      ctx.fillStyle = "white"
      ctx.fillRect(settings.player1[0], newPos, settings.sizeBall, settings.sizeBall * 4)
    }
  }
}

let print = (ctx: any, newPos: number, settings: any) => {
  console.log("New : ", settings.ballPos[1])
  console.log("Vector : ", settings.vector[1])
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
  settings.ballPos = [settings.ballPos[0] + settings.vector[0], settings.ballPos[1] + settings.vector[1]]
  ctx.fillStyle = "white"
  ctx.beginPath();
  ctx.fillRect(settings.ballPos[0], newPos, settings.sizeBall, settings.sizeBall)
  ctx.fill()
  ctx.closePath();
}

let moveBall = (ctx: any, globale: any, settings: any) => {
  // let ballSpeed = settings.vector[1]
  ctx.clearRect(0, 0, globale.width, globale.height)
  console.log("Ball : ",settings.ballPos[1], " : ", globale.height)
  let newPos: number = settings.ballPos[1]
  if (settings.ballPos[1] + settings.sizeBall > globale.height) {
    console.log("AAAAAAAAAAAAAAAAAAAAAAA")
    console.log(globale.height - settings.sizeBall)
    newPos = globale.height - (settings.sizeBall)
      settings.vector = [settings.vector[0], -settings.vector[1]]
      settings.ballPos = [settings.ballPos[0], newPos]
  }
  if (settings.ballPos[1] < 0) {
    console.log("AAAAAAAAAAAAAAAAAAAAAAA")
    console.log(settings.sizeBall)
    newPos = (0)
      settings.vector = [settings.vector[0], -settings.vector[1]]
      settings.ballPos = [settings.ballPos[0], newPos]
  }
  if (settings.ballPos[0] - settings.sizeBall > globale.width) {
      settings.end = 1
  }
  // =========== Bot ou joueur distant ==========
  if (settings.player2[0] + 51 < settings.ballPos[1]) {
    movePlayer(ctx, 100, globale, 2, settings)
  }
  if (settings.player2[0] + 49 > settings.ballPos[1]) {
    movePlayer(ctx, -100, globale, 2, settings)
  }
  // ============== Fin Bot ===============
  if (settings.ballPos[1] - settings.sizeBall <= 0) {
      settings.vector = [settings.vector[0], -settings.vector[1]]
  }
  if (settings.ballPos[0] + settings.sizeBall >= globale.width && settings.player2[1] < settings.ballPos[1] + settings.sizeBall && settings.ballPos[1] - settings.sizeBall < settings.player2[1] + 100) {
      settings.vector = [-settings.vector[0], settings.vector[1]]
  }
  if (settings.ballPos[0] <= 10 && settings.player1[1] < settings.ballPos[1] + settings.sizeBall && settings.ballPos[1] - settings.sizeBall < settings.player1[1] + 100) {
      settings.vector = [-settings.vector[0], settings.vector[1]]
  }
  if (settings.ballPos[0] + settings.sizeBall < 0) {
        settings.end = 1
   }
  if (settings.ballPos[0] - settings.sizeBall > globale.width) {
      settings.end = 1
  }
  if (!settings.end) {
    window.requestAnimationFrame(() => {
      moveBall(ctx, globale, settings)
    })
  } else {
    gameOver()
  }
  print(ctx, newPos, settings)
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

  moveBall(ctx, globale, settings)

  let infosClavier = (e: KeyboardEvent) => {
    let number = Number(e.keyCode);
      switch (number) {
        case 38:
          movePlayer(ctx, -1, globale, 1, settings)
          break;
        case 40:
          movePlayer(ctx, 1, globale, 1, settings)
          break;
        default:
    }
  }

  document.addEventListener("keydown", infosClavier);
  // document.addEventListener("keyup", () => {settings.move = 0});
}

let settings = () => {
  const globale = document.getElementById('globale') as HTMLCanvasElement
  const ctx: any = globale.getContext('2d')
//===============interaction=================

  let element = document.body as HTMLDivElement,
  winWidth: number = element.clientWidth,
  winHeight: number = element.clientHeight
  if ((winWidth * 19) / 26 > winHeight)
    winWidth = ((winHeight * 26) / 19)
  else
    winHeight = ((winWidth * 19) / 26)
  let settings = {
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
    vector: [5, 5],
    speed: 4,
    middle: winWidth / 2,
    end: 0,
    move: 0
  }

  setTimeout(() => {init(ctx, globale, settings)}, 1000)
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


//============ Settings game ===============
  componentDidMount = () => {
    let element = document.body as HTMLDivElement;
    console.log("client " + element.clientHeight)
    console.log("client " + element.clientWidth)
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
      settings()
  }

  render() {
    window.onresize = () => {window.location.reload()}
    return (
      <div>
        <div className="canvas" id="canvas">
          <canvas ref="globale" id="globale" width={this.state.w} height={this.state.h}></canvas>
        </div>
      </div>
    );
  }
}

export default Game;
