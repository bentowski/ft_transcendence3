import { Component } from 'react';
// import Menu from '../components/Menu'
import '../styles/components/game.css'



class Game extends Component<
                        {},
                        { w:number,
                          h: number,
                          nbPlayer: number,
                          playerHighStart: number,
                          playerPos: number[],
                          playerSpeed: number,
                          sizeBall: number,
                          ballPos: number[],
                          vector: number[],
                          middle: number,
                          score1: number,
                          score2: number,
                          end: number,
                          first1: boolean
                        }> {
  constructor(props: any)
  {
    super(props)
    this.state = {
      w: 12,
      h: 0,
      nbPlayer: 0,
      playerHighStart: 0,
      playerPos: [0, 0],
      playerSpeed: 0,
      sizeBall: 0,
      ballPos: [0, 0],
      vector: [0, 0],
      middle: 0,
      score1: 0,
      score2: 0,
      end: 0,
      first1: true
    }
  }


//=================initialisation================
  init = (ctx: any, j1Ctx: any, j2Ctx: any, globale: any, joueur1: any, joueur2: any) => {
    //======ligne centrale=========
    let h = 0;
    let y = 0;
    while (h < this.state.h) {
      ctx.fillStyle = "white"
      ctx.fillRect(this.state.middle, y, 10, 25)
      y += 50
      console.log("h: " + this.state.h)
      h += 50
    }
    //======joueurs========
    console.log("limit : " + this.state.playerHighStart)
    console.log("current :" + this.state.playerPos[0])
    while (this.state.playerPos[0] < this.state.playerHighStart) {
      j1Ctx.fillStyle = "white"
      j1Ctx.fillRect(2, this.state.playerPos[0], 10, 5)
      j2Ctx.fillStyle = "white"
      j2Ctx.fillRect(-2, this.state.playerPos[1], 10, 5)
      this.setState({playerPos: [this.state.playerPos[0] + 5, this.state.playerPos[1] + 5]})
    }
    //========balle========
    ctx.fillStyle = "white"
    ctx.arc(this.state.ballPos[0], this.state.ballPos[1], this.state.sizeBall, 0, 2 * Math.PI);
    ctx.fill()
    this.moveBall(ctx, j1Ctx, j2Ctx, globale, joueur1, joueur2)
  }

//=============== Move Player ==================
  movePlayer = (limit: number, jCtx: any, move: number, joueur: any) => {
    if (this.state.playerPos[0] < limit) {
      if (this.state.first1) {
        this.setState({playerPos: [this.state.playerPos[0] + move, this.state.playerPos[1]]})
      }
      this.setState({playerPos: [this.state.playerPos[0] + this.state.playerSpeed, this.state.playerPos[1]]})
      jCtx.clearRect(0, 0, joueur.width, joueur.height);
      jCtx.fillStyle = "white"
      jCtx.fillRect(2, this.state.playerPos[0], 10, 100)
      this.setState({first1: false})
    }
  }

  //=============== Move Ball===================


    moveBall = (ctx: any, j1Ctx: any, j2Ctx: any, globale: any, joueur1: any, joueur2: any) => {
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
      if (this.state.playerPos[0] + 51 < this.state.ballPos[1]) {
        this.movePlayer(800, j1Ctx, 100, joueur1)
      }
      if (this.state.playerPos[0] + 49 > this.state.ballPos[1]) {
        this.movePlayer(0, j1Ctx, -100, joueur1)
      }
      // ============== Fin Bot ===============
      if (this.state.ballPos[1] + this.state.sizeBall <= globale.height) {
        this.setState({vector: [this.state.vector[0], -this.state.vector[1]]})
      }
      if (this.state.ballPos[1] - this.state.sizeBall >= 0) {
        this.setState({vector: [this.state.vector[0], -this.state.vector[1]]})
      }
      if (this.state.ballPos[0] + this.state.sizeBall >= globale.width && this.state.playerPos[1] < this.state.ballPos[1] + this.state.sizeBall && this.state.ballPos[1] - this.state.sizeBall < this.state.playerPos[1] + 100) {
        this.setState({vector: [-this.state.vector[0], this.state.vector[1]]})
      }
      if (this.state.ballPos[0] <= 10 && this.state.playerPos[0] < this.state.ballPos[1] + this.state.sizeBall && this.state.ballPos[1] - this.state.sizeBall < this.state.playerPos[0] + 100) {
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
          this.moveBall(ctx, j1Ctx, j2Ctx, globale, joueur1, joueur2)
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
    if (window.innerHeight > window.innerWidth) {
      this.setState({ w: window.innerWidth, h : window.innerWidth / 16 * 9 })
    }
    else {
      console.log("Window width : " + window.innerWidth)
      console.log(window.innerWidth / 9 * 16)
      let test: number = window.innerWidth / 9 * 16
      console.log(test)
      this.setState({ h: window.innerHeight, w : test })
      console.log(this.state.w)
    }
    this.setState({h: 1200})
    console.log("h: " + this.state.h)
    this.setState({
      nbPlayer: 1,
      playerHighStart: this.state.h / 2,
      playerPos: [this.state.h / 2, this.state.h / 2],
      playerSpeed: 5,
      sizeBall: 100,
      ballPos: [this.state.w / 2, this.state.h / 2],
      vector: [0, 0],
      middle: this.state.w / 2
    })

    console.log("Initvariable ===========================")
    console.log("h : " + this.state.h)
    console.log("playerStart : " + this.state.playerHighStart)
    console.log("playerPos : " + this.state.playerPos[0])
    console.log("InitGame ===========================")
  //============== variables ==============
    const globale = this.refs.globale as HTMLCanvasElement
    const ctx: any = globale.getContext('2d')
    const joueur1 = this.refs.joueur1 as HTMLCanvasElement
    const j1Ctx: any = joueur1.getContext('2d')
    const joueur2 = this.refs.joueur2 as HTMLCanvasElement
    const j2Ctx: any = joueur2.getContext('2d')

  //===============interaction=================

    let infosClavier = (e: KeyboardEvent) => {
      let number = Number(e.keyCode);
        console.log(number)
        switch (number) {
          case 38:
            this.movePlayer(800, j2Ctx, 1, joueur2)
            break;
          case 40:
            this.movePlayer(0, j2Ctx, -1, joueur2)
            break;
          default:
      }
    }
    document.addEventListener("keydown", infosClavier);

    this.init(ctx, j1Ctx, j2Ctx, globale, joueur1, joueur2)
  }



  render() {
    window.onresize = () => {window.location.reload()}
    // console.log("Window width : " + window.innerWidth)
    return (
      <div>
      {/*<Menu />*/}
        <h1>GAME</h1>
        <div className="canvas">
          <canvas ref="joueur1" id="joueur1" width={this.state.w / 100} height={this.state.h}></canvas>
          <canvas ref="globale" id="globale" width={this.state.w} height={this.state.h}></canvas>
          <canvas ref="joueur2" id="joueur2" width={this.state.w / 100} height={this.state.h}></canvas>
        </div>
      </div>
    );
  }
}

export default Game;
