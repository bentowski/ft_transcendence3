import { Component } from 'react';
import { socket, WebsocketProvider, WebsocketContext } from '../contexts/WebSocketContextGame';
import Request from "../components/utils/Requests"
// import Menu from '../components/Menu'
import '../styles/pages/game.css'
import ModalMatchWaiting from '../components/utils/ModalMatchWaiting';
import { io } from 'socket.io-client';
import {useAuthData} from "../contexts/AuthProviderContext";

//const updateSocket = io("http://localhost:3000/update");

let ball = new Image();
let p1 = new Image();
let p2 = new Image();
let bubble = new Image();

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
        ctx.drawImage(p1, settings.player1[0], newPos, settings.sizeBall, settings.sizeBall * 4)
    }
}

let movePlayer1 = (ctx: any, globale: any, position: number, settings: any) => {
    let newPos = position
    if (newPos > 0 && newPos < settings.h - settings.playerSize) {
        settings.player1 = [settings.player1[0], newPos]
        ctx.clearRect(settings.player1[0] - 1, 0, settings.sizeBall + 2, globale.height);
        ctx.drawImage(p1, settings.player1[0], newPos, settings.sizeBall, settings.sizeBall * 4)
    }
}

let movePlayer2 = (ctx: any, globale: any, position: number, settings: any) => {
    let newPos = position
    if (newPos > 0 && newPos < settings.h - settings.playerSize) {
        settings.player2 = [settings.player2[0], newPos]
        ctx.clearRect(settings.player2[0] - 1, 0, settings.sizeBall + 2, globale.height);
        ctx.drawImage(p2, settings.player2[0], newPos, settings.sizeBall, settings.sizeBall * 4)
    }
}


let print = (ctx: any, newPos: number, settings: any) => {
    let y = 0;
    while (y < settings.h) {
        ctx.drawImage(bubble, settings.middle - settings.sizeBall / 2, y - settings.sizeBall / 2, settings.sizeBall, settings.sizeBall * 2)
        y += settings.sizeBall * 2
    }
    ctx.drawImage(p2, settings.player2[0], settings.player2[1], settings.sizeBall, settings.sizeBall * 4)
    ctx.drawImage(p1, settings.player1[0], settings.player1[1], settings.sizeBall, settings.sizeBall * 4)
    settings.ballPos = [settings.ballPos[0] + (settings.vector[0] * settings.speed), settings.ballPos[1] + (settings.vector[1]  * settings.speed)]
    if (settings.ballPos[0] < 0)
        settings.ballPos[0] = 1;
    if (settings.ballPos[0] > settings.w)
        settings.ballPos[0] = settings.w - 1;
    ctx.beginPath();
    ctx.drawImage(ball, settings.ballPos[0] - settings.sizeBall / 2, newPos - settings.sizeBall / 2, settings.sizeBall, settings.sizeBall)
    ctx.fill()
    ctx.closePath();
}

let moveBall = (ctx: any, globale: any, settings: any) => {
    let newPos: number = settings.ballPos[1]
    ctx.clearRect(0, 0, globale.width, globale.height)
    if (settings.admin) {
        if (settings.ballPos[1] + (settings.sizeBall / 2) >= globale.height) {
            newPos = globale.height - (settings.sizeBall / 2)
            settings.vector = [settings.vector[0], -settings.vector[1]]
            settings.ballPos = [settings.ballPos[0], newPos]
        }
        if (settings.ballPos[1] - (settings.sizeBall / 2) < 0) {
            newPos = (0 + (settings.sizeBall / 2))
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
        if (settings.ballPos[0] + settings.sizeBall / 2 >= settings.player1[0]) {
            if (settings.ballPos[1] >= settings.player1[1] && settings.ballPos[1] <= settings.player1[1] + settings.sizeBall * 4) {
                let percent = Math.floor((settings.ballPos[1] - settings.player1[1]) / ((settings.player1[1] + settings.sizeBall * 4) - settings.player1[1]) * 100)
                if (percent <= 20) {
                    settings.vector = [-0.5, -Math.sqrt(3) / 2];
                }
                else if (percent <= 40) {
                    settings.vector = [-Math.sqrt(3) / 2, -0.5];
                }
                else if (percent <= 60) {
                    settings.vector = [-1, 0];
                }
                else if (percent <= 80) {
                    settings.vector = [-Math.sqrt(3) / 2, 0.5];
                }
                else {
                    settings.vector = [-0.5, Math.sqrt(3) / 2];
                }
            }
            else {
                settings.ballPos = [settings.w / 2, settings.h / 2]
                settings.speed = settings.baseSpeed
                //! give point to p1
            }
        }
        if (settings.ballPos[0] <= settings.player2[0] + settings.sizeBall * 1.5)
        {
            if (settings.ballPos[1] >= settings.player2[1] && settings.ballPos[1] <= settings.player2[1] + settings.sizeBall * 4) {
                let percent = Math.floor((settings.ballPos[1] - settings.player2[1]) / ((settings.player2[1] + settings.sizeBall * 4) - settings.player2[1]) * 100)
                if (percent <= 20) {
                    settings.vector = [0.5, -Math.sqrt(3) / 2];
                }
                else if (percent <= 40) {
                    settings.vector = [Math.sqrt(3) / 2, -0.5];
                }
                else if (percent <= 60) {
                    settings.vector = [1, 0];
                }
                else if (percent <= 80) {
                    settings.vector = [Math.sqrt(3) / 2, 0.5];
                }
                else {
                    settings.vector = [0.5, Math.sqrt(3) / 2];
                }
            }
            else {
                settings.ballPos = [settings.w / 2, settings.h / 2]
                settings.speed = settings.baseSpeed
                //! give point to p2
            }
            settings.speed++;
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
        socket.emit('moveBall', {"room": settings.room, "ballPos": [settings.ballPos[0] / settings.w, settings.ballPos[1] / settings.h]})
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
    p1.src = "http://localhost:8080/pictures/barre2.png";
    p2.src = "http://localhost:8080/pictures/barre1.png";
    ball.src = "http://localhost:8080/pictures/ball.png";
    bubble.src = "http://localhost:8080/pictures/bubble2.png";
    while (y < settings.h) {
        ctx.drawImage(bubble, settings.middle - settings.sizeBall / 2, y - settings.sizeBall / 2, settings.sizeBall, settings.sizeBall * 2)
        y += settings.sizeBall * 2
    }
    //======joueurs========
    ctx.drawImage(p1, settings.player2[0], settings.player2[1], settings.sizeBall, settings.sizeBall * 4)
    ctx.drawImage(p2, settings.player1[0], settings.player1[1], settings.sizeBall, settings.sizeBall * 4)

    //========balle========
    ctx.drawImage(ball, settings.ballPos[0] - settings.sizeBall / 2, settings.ballPos[1] - settings.sizeBall / 2, settings.sizeBall, settings.sizeBall)
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
        if (settings.admin || ball.room !== settings.room)
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
    baseSpeed: 5,
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
}

let setSettings = () => {
    //===============interaction=================
    const globale = document.getElementById('globale') as HTMLCanvasElement
    const ctx: any = globale.getContext('2d')
    const { user } = useAuthData();

    let currentUser: any = user;
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
        player1: [winWidth - winHeight / 20, (winHeight / 2) - (winHeight / 15)],
        player2: [0 + winHeight / 20 - winHeight / 30, (winHeight / 2) - (winHeight / 15)],
        playerSpeed: 10,
        sizeBall:  winHeight / 30,
        ballPos: [winWidth / 2, winHeight / 2],
        vector: [1, 0],
        baseSpeed: settings.baseSpeed,
        speed: settings.baseSpeed,
        middle: winWidth / 2,
        end: 0,
        move: 0,
        currentUser: currentUser,
        spec: true,
        admin: settings.admin,
        room: url,
        gameStarted: settings.gameStarted,
        timer: settings.timer,
        callback: settings.callback,
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
    const { user } = useAuthData();
    const currentUser = user;
    socket.emit('joinRoom', {"game":game, "auth_id": currentUser.auth_id})
    if (game.p1 === null || game.p1 === currentUser.auth_id) {
        settings.admin = true;
    }
    if ((game.p1 && game.p1 === currentUser.auth_id) || (game.p2 && game.p2 === currentUser.auth_id) || !game.p1 || !game.p2)
        settings.spec = false
    socket.on('userJoinChannel', (game:any) => {
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

    // modalCountDown = () => {
    // if (settings.gameStarted === true && settings.timer >= 0)
    // 	return (<ModalMatchWaiting title="Create new game" calledBy="newGame" countdown={settings.timer}/>)
    // else
    // 	return (<ModalMatchWaiting title="Create new game" calledBy="newGame" />)
    // }

    render() {
        window.onresize = () => {window.location.reload()}
        return (
            <div>
                <div className="canvas" id="canvas">
                    <canvas ref="globale" id="globale" width={this.state.w} height={this.state.h} style={{backgroundImage: "url(http://localhost:8080/pictures/bg-pong.jpg)", backgroundPosition: "center", backgroundSize: "cover"}}></canvas>
                    <ModalMatchWaiting title="Create new game" calledBy="newGame" />
                </div>
            </div>
        );
    }
}

export default Game;