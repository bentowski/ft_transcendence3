import {Component} from 'react';
import './game.css'

class Game extends Component {

//code js pour le jeu
  componentDidMount() {
    //============== variables==============
    let middle: number = (1500 / 2) - 5
      , hMax: number =window.innerHeight
      , h: number =0
      , jHeight: number =500
      , yJ1: number =400
      , yJ2: number =400
      , first1: boolean =true
      , first2: boolean =true
      , xBalle: number =300
      , yBalle: number =400
      , sizeBalle: number =10
      , levelUp: number =0.5
      , vitessex: number =sizeBalle/2
      , vitessey: number =sizeBalle/2
      , game: boolean =true
      , player:number
      , speed1: number =10
      , speed2: number =10
      , y: number =-10
    const globale  = this.refs.globale as HTMLCanvasElement
    const ctx : any = globale.getContext('2d')
    const joueur1 = this.refs.joueur1 as HTMLCanvasElement
    const j1Ctx : any = joueur1.getContext('2d')
    const joueur2 = this.refs.joueur2 as HTMLCanvasElement
    const j2Ctx : any = joueur2.getContext('2d')

    //===============interaction=================
    let test : any = prompt("combien de joueur ?","1")
    if (test )
      player=(parseInt(test))
    else
      player = 1;
    if(player===1){
      speed2=40
    }
    if(player===2){
      speed1=40
      speed2=40
    }

    let infosClavier = (e : KeyboardEvent) => {
      let number = Number(e.keyCode);
      if(number===13){
        init()
      }
      if(player===1){
        switch (number) {
          case 38:
            j2Up()
            break;
          case 40:
            j2Down()
            break;
            default:
            console.log("error one player");
          }
      }
      if(player===2){
        switch (number) {
          case 90:
            j1Up()
            break;
          case 83:
            j1Down()
            break;
          case 38:
            j2Up()
            break;
          case 40:
            j2Down()
            break;
          default:
          console.log("erreur two players");
        }
      }
    }

    document.addEventListener("keydown", infosClavier);



    //===============joueur1===================
    let j1Down = ()=>{
      if(yJ1<800){
        if(first1){
          yJ1-=100
        }
        yJ1+=speed1
        j1Ctx.clearRect(0, 0, joueur1.width, joueur1.height);
        j1Ctx.fillStyle="white"
        j1Ctx.fillRect(2,yJ1,10,100)
        first1=false
      }
    }


    let j1Up = ()=>{
      if(yJ1>0){
        if(first1){
          yJ1-=100
        }
        yJ1-=speed1
        j1Ctx.clearRect(0, 0, joueur1.width, joueur1.height);
        j1Ctx.fillStyle="white"
        j1Ctx.fillRect(2,yJ1,10,100)
        first1=false
      }
    }


    //=================joueur2===================
    let j2Down = ()=>{
      if(yJ2<800){
        if(first2){
          yJ2-=100
        }
        yJ2+=speed2
        j2Ctx.clearRect(0, 0, joueur2.width, joueur2.height);
        j2Ctx.fillStyle="white"
        j2Ctx.fillRect(-2,yJ2,10,100)
        first2=false
      }
    }

    let j2Up = ()=>{
      if(yJ2>0){
        if(first2){
          yJ2-=100
        }
        yJ2-=speed2
        j2Ctx.clearRect(0, 0, joueur2.width, joueur2.height);
        j2Ctx.fillStyle="white"
        j2Ctx.fillRect(-2,yJ2,10,100)
        first2=false
      }
    }

    //===============ball===================
    let moveBall = () =>{
        ctx.clearRect(0,0,globale.width,globale.height)
        y=0
        h=0
        while(h<hMax){
        ctx.fillStyle="white"
        ctx.fillRect(middle, y, 10, 25)
        y+=50
        h+=50
        }
        xBalle+=vitessex
        yBalle+=vitessey
        ctx.fillStyle="white"
        ctx.beginPath();
        ctx.arc(xBalle,yBalle,sizeBalle,0,2*Math.PI);
        ctx.fill()
        ctx.closePath();
        if(player===1){
          if(yJ1+51<yBalle){
            j1Down()
          }
          if(yJ1+49>yBalle){
            j1Up()
          }
        }
        if(player===0){
          if(yJ1+51<yBalle){
            j1Down()
          }
          if(yJ1+49>yBalle){
            j1Up()
          }
          if(yJ2+51<yBalle){
            j2Down()
          }
          if(yJ2+49>yBalle){
            j2Up()
          }
        }
        if(yBalle+sizeBalle<=globale.height){
          vitessey=-vitessey

        }
        if(yBalle-sizeBalle>=0){
          vitessey=-vitessey
        }
        if(xBalle+sizeBalle>=globale.width && yJ2<yBalle+sizeBalle && yBalle-sizeBalle<yJ2+100){
          vitessex=-vitessex
        }
        if(xBalle<=10 && yJ1<yBalle+sizeBalle && yBalle-sizeBalle<yJ1+100){
          vitessex=-vitessex
          vitessex+=levelUp
        }
        if(xBalle+sizeBalle<0){
          game=false
        }
        if(xBalle-sizeBalle>globale.width){
          game=false
        }
        if(game){
          window.requestAnimationFrame(moveBall)
        }else if(vitessex>35){
            gameOver()
          } else {
            console.log("WIN !!!");
          }
    }

    let gameOver = ()=>{
      alert("GAME OVER")
    }

  //=================initialisation================

  let init = () => {
    //======ligne centrale=========
    while(h<hMax){
      ctx.fillStyle="white"
      ctx.fillRect(middle, y, 10, 25)
      y+=50
      h+=50
    }
    //======joueurs========
    while(yJ1<jHeight){
      j1Ctx.fillStyle="white"
      j1Ctx.fillRect(2,yJ1,10,5)
      j2Ctx.fillStyle="white"
      j2Ctx.fillRect(-2,yJ2,10,5)
      yJ1+=5
      yJ2+=5
    }
    //========balle========
    ctx.fillStyle="white"
    ctx.arc(xBalle,yBalle,sizeBalle,0,2*Math.PI);
    ctx.fill()
    moveBall()
  }
  init()
}

  render() {
    return (
      <div>
        <h1>GAME</h1>
        <div className="canva">
          <canvas ref="joueur1" id="joueur1" width="12" height="900"></canvas>
          <canvas ref="globale" id="globale" width="1500" height="900"></canvas>
          <canvas ref="joueur2" id="joueur2" width="12" height="900"></canvas>
        </div>
      </div>
    );
  }
}

export default Game;
