import { Component } from 'react';
// import Menu from '../components/Menu'
import '../styles/components/game.css'



class Game extends Component<
                        {},
                        { w:number,
                          h: number,
                          nbPlayer: number,
                          playerHighStart: number,
                          playerSize: number,
                          player1: number[],
                          player2: number[],
                          playerSpeed: number,
                          sizeBall: number,
                          ballPos: number[],
                          vector: number[],
                          middle: number,
                          score1: number,
                          score2: number,
                          end: number,
                          speed: number,
                        }> {
  constructor(props: any)
  {
    super(props)
    this.state = {
      w: 0,
      h: 0,
      nbPlayer: 0,
      playerHighStart: 0,
      playerSize: 0,
      player1: [0, 0],
      player2: [0, 0],
      playerSpeed: 0,
      sizeBall: 0,
      ballPos: [0, 0],
      vector: [0, 0],
      middle: 0,
      score1: 0,
      score2: 0,
      end: 0,
      speed: 1,
    }
  }

//=================initialisation================
  init = (ctx: any, globale: any) => {
    //======ligne centrale=========
    let y = 0;
    while (y < this.state.h) {
      ctx.fillStyle = "white"
      ctx.fillRect(this.state.middle, y, this.state.sizeBall / 10, this.state.sizeBall)
      y += this.state.sizeBall * 2
    }
    //======joueurs========
    ctx.fillStyle = "white"
    ctx.fillRect(this.state.player2[0], this.state.player2[1], this.state.sizeBall, this.state.sizeBall * 4)
    ctx.fillStyle = "white"
    ctx.fillRect(this.state.player1[0], this.state.player1[1], this.state.sizeBall, this.state.sizeBall * 4)

    //========balle========
    ctx.fillStyle = "white"
    ctx.fillRect(this.state.ballPos[0], this.state.ballPos[1], this.state.sizeBall, this.state.sizeBall)
    ctx.fill()

    // this.moveBall(ctx, globale)

    let infosClavier = (e: KeyboardEvent) => {
      let number = Number(e.keyCode);
        switch (number) {
          case 38:
            this.movePlayer(ctx, 1, globale, 1)
            break;
          case 40:
            this.movePlayer(ctx, -1, globale, 1)
            break;
          default:
      }
    }
    document.addEventListener("keydown", infosClavier);
  }

//=============== Move Player ==================
  movePlayer = (ctx: any, move: number, globale: any, currentPlayer: number) => {
    if (currentPlayer == 1)
    {
      let newPos = this.state.player1[1] + (move * this.state.playerSpeed)
      if (newPos > 0 && newPos < this.state.h) {
        this.setState({player1: [this.state.player1[0], newPos], speed: this.state.speed + 0.1})
        ctx.clearRect(this.state.player1[0], 0, this.state.sizeBall, globale.height);
        ctx.fillStyle = "white"
        ctx.fillRect(this.state.player1[0], newPos, this.state.sizeBall, this.state.sizeBall * 4)
      }
    }
  }

  //=============== Move Ball===================


    moveBall = (ctx: any, globale: any) => {
      ctx.clearRect(0, 0, globale.width, globale.height)
      let y = 0
      let h = 0
      while (h < this.state.h) {
        ctx.fillStyle = "white"
        ctx.fillRect(this.state.middle, y, 10, 25)
        y += 50
        h += 50
      }
      this.setState({ballPos: [this.state.ballPos[0] + this.state.vector[0], this.state.ballPos[1] + this.state.vector[1]]})
      ctx.fillStyle = "white"
      ctx.beginPath();
      ctx.arc(this.state.ballPos[0], this.state.ballPos[1], this.state.sizeBall, 0, 2 * Math.PI);
      ctx.fill()
      ctx.closePath();
      // =========== Bot ou joueur distant ==========
      if (this.state.player2[0] + 51 < this.state.ballPos[1]) {
        this.movePlayer(ctx, 100, globale, 2)
      }
      if (this.state.player2[0] + 49 > this.state.ballPos[1]) {
        this.movePlayer(ctx, -100, globale, 2)
      }
      // ============== Fin Bot ===============
      if (this.state.ballPos[1] + this.state.sizeBall <= globale.height) {
        this.setState({vector: [this.state.vector[0], -this.state.vector[1]]})
      }
      if (this.state.ballPos[1] - this.state.sizeBall >= 0) {
        this.setState({vector: [this.state.vector[0], -this.state.vector[1]]})
      }
      if (this.state.ballPos[0] + this.state.sizeBall >= globale.width && this.state.player2[1] < this.state.ballPos[1] + this.state.sizeBall && this.state.ballPos[1] - this.state.sizeBall < this.state.player2[1] + 100) {
        this.setState({vector: [-this.state.vector[0], this.state.vector[1]]})
      }
      if (this.state.ballPos[0] <= 10 && this.state.player1[1] < this.state.ballPos[1] + this.state.sizeBall && this.state.ballPos[1] - this.state.sizeBall < this.state.player1[1] + 100) {
        this.setState({vector: [-this.state.vector[0], this.state.vector[1]]})
      }
      if (this.state.ballPos[0] + this.state.sizeBall < 0) {
          this.setState({end: 1})
       }
      if (this.state.ballPos[0] - this.state.sizeBall > globale.width) {
        this.setState({end: 1})
      }
      if (this.state.end) {
        window.requestAnimationFrame(() => {
          this.moveBall(ctx, globale)
        })
      } else if (this.state.vector[0] > 35) {
        this.gameOver()
      }
    }



  gameOver = () => {
    alert("GAME OVER")
  }



//============ Settings game ===============
  componentDidMount = () => {
    let element = document.body as HTMLDivElement;
    console.log("client " + element.clientHeight)
    console.log("client " + element.clientWidth)
    let winWidth = element.clientWidth
    console.log("Width : " + winWidth)
    console.log("fuck : " + winWidth / 16 * 9)
    let winHeight = element.clientHeight
    console.log("Height : " + winHeight)
    if (winHeight > winWidth) {
      this.setState({
        // A Changer ==================== !!!!!!!!!!!!!!!!!!!!!!!
          h: winHeight,
          w : winWidth / 16 * 9,
          nbPlayer: 1,
          playerHighStart: winHeight / 2 + (winHeight / 25),
          playerSize: winHeight / 25,
          player1: [0, (winHeight / 2) - (winHeight / 25)],
          player2: [0, (winHeight / 2) - (winHeight / 25)],
          playerSpeed: 20,
          sizeBall: 20,
          ballPos: [(winWidth / 9 * 16) / 2, winHeight / 2],
          vector: [0, 0],
          middle: (winWidth / 9 * 16) / 2
         })
    }
    else {
      this.setState({
          h: winHeight,
          w : winWidth,
          nbPlayer: 1,
          playerHighStart: winHeight / 2 + (winHeight / 25),
          playerSize: winHeight / 25,
          player1: [0, (winHeight / 2) - (winHeight / 25)],
          player2: [0, (winHeight / 2) - (winHeight / 25)],
          playerSpeed: 20,
          sizeBall: 10,
          ballPos: [(winWidth / 9 * 16) / 2, winHeight / 2],
          vector: [0, 0],
          middle: (winWidth / 9 * 16) / 2
        })
    }

  //============== variables ==============
    const globale = this.refs.globale as HTMLCanvasElement
    const ctx: any = globale.getContext('2d')
  //===============interaction=================
    setTimeout(() => {this.init(ctx, globale)}, 1000)
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
