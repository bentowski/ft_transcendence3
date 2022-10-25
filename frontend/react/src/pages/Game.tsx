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

    this.moveBall(ctx, globale)

    let infosClavier = (e: KeyboardEvent) => {
      let number = Number(e.keyCode);
        switch (number) {
          case 38:
            this.movePlayer(ctx, -1, globale, 1)
            break;
          case 40:
            this.movePlayer(ctx, 1, globale, 1)
            break;
          default:
      }
    }

    document.addEventListener("keydown", infosClavier);
    // document.addEventListener("keyup", infosClavier);
  }

//=============== Move Player ==================
  movePlayer = (ctx: any, move: number, globale: any, currentPlayer: number) => {
    if (currentPlayer == 1)
    {
      let newPos = this.state.player1[1] + (move * this.state.playerSpeed)
      if (newPos > 0 && newPos < this.state.h - this.state.playerSize) {
        this.setState({player1: [this.state.player1[0], newPos], speed: this.state.speed + 0.1})
        ctx.clearRect(this.state.player1[0] - 1, 0, this.state.sizeBall + 2, globale.height);
        ctx.fillStyle = "white"
        ctx.fillRect(this.state.player1[0], newPos, this.state.sizeBall, this.state.sizeBall * 4)
      }
    }
  }

  //=============== Move Ball===================

  test = (globale: any) => {
    this.setState({
      vector: [this.state.vector[0], -this.state.vector[1]],
      ballPos: [this.state.ballPos[0], globale.height - (this.state.sizeBall * 2)]
    })
 }

    print = (ctx: any, globale: any, newPos: number) => {
      console.log("New : ", this.state.ballPos[1])
      console.log("Vector : ", this.state.vector[1])
      let y = 0;
      while (y < this.state.h) {
        ctx.fillStyle = "white"
        ctx.fillRect(this.state.middle, y, this.state.sizeBall / 10, this.state.sizeBall)
        y += this.state.sizeBall * 2
      }
      ctx.fillStyle = "white"
      ctx.fillRect(this.state.player2[0], this.state.player2[1], this.state.sizeBall, this.state.sizeBall * 4)
      ctx.fillStyle = "white"
      ctx.fillRect(this.state.player1[0], this.state.player1[1], this.state.sizeBall, this.state.sizeBall * 4)
      this.setState({ballPos: [this.state.ballPos[0] + this.state.vector[0], this.state.ballPos[1] + this.state.vector[1]]})
      ctx.fillStyle = "white"
      ctx.beginPath();
      ctx.fillRect(this.state.ballPos[0], newPos, this.state.sizeBall, this.state.sizeBall)
      ctx.fill()
      ctx.closePath();
    }

    moveBall = (ctx: any, globale: any) => {
      // let ballSpeed = this.state.vector[1]
      ctx.clearRect(0, 0, globale.width, globale.height)
      console.log("Ball : ",this.state.ballPos[1], " : ", globale.height)
      let newPos: number = this.state.ballPos[1]
      if (this.state.ballPos[1] + this.state.sizeBall > globale.height) {
        console.log("AAAAAAAAAAAAAAAAAAAAAAA")
        console.log(globale.height - this.state.sizeBall)
        newPos = globale.height - (this.state.sizeBall)
        this.setState({
          vector: [this.state.vector[0], -this.state.vector[1]],
          ballPos: [this.state.ballPos[0], newPos]
        })
      }
      if (this.state.ballPos[1] < 0) {
        console.log("AAAAAAAAAAAAAAAAAAAAAAA")
        console.log(this.state.sizeBall)
        newPos = (0)
        this.setState({
          vector: [this.state.vector[0], -this.state.vector[1]],
          ballPos: [this.state.ballPos[0], newPos]
        })
      }
      this.print(ctx, globale, newPos)

      // // =========== Bot ou joueur distant ==========
      // if (this.state.player2[0] + 51 < this.state.ballPos[1]) {
      //   this.movePlayer(ctx, 100, globale, 2)
      // }
      // if (this.state.player2[0] + 49 > this.state.ballPos[1]) {
      //   this.movePlayer(ctx, -100, globale, 2)
      // }
      // // ============== Fin Bot ===============
      // if (this.state.ballPos[1] - this.state.sizeBall <= 0) {
      //   this.setState({vector: [this.state.vector[0], -this.state.vector[1]]})
      // }
      // if (this.state.ballPos[0] + this.state.sizeBall >= globale.width && this.state.player2[1] < this.state.ballPos[1] + this.state.sizeBall && this.state.ballPos[1] - this.state.sizeBall < this.state.player2[1] + 100) {
      //   this.setState({vector: [-this.state.vector[0], this.state.vector[1]]})
      // }
      // if (this.state.ballPos[0] <= 10 && this.state.player1[1] < this.state.ballPos[1] + this.state.sizeBall && this.state.ballPos[1] - this.state.sizeBall < this.state.player1[1] + 100) {
      //   this.setState({vector: [-this.state.vector[0], this.state.vector[1]]})
      // }
      // if (this.state.ballPos[0] + this.state.sizeBall < 0) {
      //     this.setState({end: 1})
      //  }
      if (this.state.ballPos[0] - this.state.sizeBall > globale.width) {
        this.setState({end: 1})
      }
      if (!this.state.end) {
        window.requestAnimationFrame(() => {
          this.moveBall(ctx, globale)
        })
      } else {
        this.gameOver()
      }
    }



  gameOver = () => {
    // PRINT WIN & Redirect ==============================
    // window.location.href = "http://localhost:8080/profil"
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
        nbPlayer: 1,
        playerHighStart: winHeight / 2 + (winHeight / 25),
        playerSize: (winHeight / 30) * 4,
        player1: [winWidth - winHeight / 20, (winHeight / 2) - (winHeight / 25)],
        player2: [0, (winHeight / 2) - (winHeight / 25)],
        playerSpeed: 20,
        sizeBall: winHeight / 30,
        ballPos: [winWidth / 2, winHeight / 2],
        vector: [0, 5],
        middle: winWidth / 2,
        end: 0
      })


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
