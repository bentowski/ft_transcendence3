import { OnModuleInit } from '@nestjs/common';
import {
 SubscribeMessage,
 WebSocketGateway,
 WebSocketServer,
 MessageBody
} from '@nestjs/websockets';
import { Interval } from '@nestjs/schedule';
import { Socket, Server } from 'socket.io';
import { PartiesService } from '../parties/parties.service';
import { UserService } from '../user/user.service';
import { Room, State, Config } from './room.interface';
import { GameService } from './game.service';
import PartiesEntity from '../parties/entities/parties-entity';
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080'],
  },
  namespace: '/game',
})
export class GameGateway implements OnModuleInit
{
	constructor(
    private readonly gameService: GameService,
    private readonly partiesService: PartiesService,
    private readonly userService: UserService
  ) {}

  rooms: Map<number, Room> = new Map()

  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {});
  }

  @SubscribeMessage('joinRoom')
   async onJoinRoom(client: Socket, body: any) {
     client.join(body.game.id);
     let currentRoom: Room|undefined = this.findRoom(body.game.id);
     if (currentRoom == undefined)
     {
       console.log("works");
       const party: PartiesEntity = await this.partiesService.findParty(body.game.id);
       currentRoom = this.createRoom(body.game.id, body.auth_id, party.nbplayer);
     }
     else if (currentRoom.mode != 1 && currentRoom.players[1] == 0
      && currentRoom.players[0] != body.auth_id)
      {
        console.log(body.auth_id, "works")
        currentRoom.players[1] = body.auth_id
        this.partiesService.addToGame(body.game.id, body.auth_id);
      }
     else if (currentRoom.players.find(element => element == body.auth_id) == undefined
      && (!currentRoom.spectators || currentRoom.spectators.find(element => element == body.auth_id) == undefined))
      {
        currentRoom.spectators.push(body.auth_id)
        console.log(body.auth_id, "Spectator")
      }
    if (currentRoom != undefined)
    {
      this.partiesService.addToGame(body.game.id, body.auth_id);
      this.server.to(body.game.id).emit("Init", {room: body.game, settings: currentRoom.config});
      if ((currentRoom.players[0] && currentRoom.players[1]) || currentRoom.mode == 1)
        this.startGame(currentRoom);
    }
   }

  @SubscribeMessage('barMove')
  onNewMessage(@MessageBody() body: any) {
    let admin: boolean
    let currentRoom: Room|undefined = this.findRoom(body.room);
    if (currentRoom != undefined)
    {
      if (body.player === currentRoom.players[0])
      {
        currentRoom.config.player1[1] =  body.ratio * 100
        admin = true
      }
      else if (body.player === currentRoom.players[1] && currentRoom.mode != 1)
      {
        currentRoom.config.player2[1] =  body.ratio * 100
        admin = false
      }
      this.server.to(body.room).emit('players', {ratio: body.ratio, player: body.player, admin: admin, room: body.room})
    }
  }

  botmove(room: Room) {
    if (room.config.ballPos[0] < 50)
    {
      console.log("detect")
      if (room.config.ballPos[1] > room.config.player2[1])
      {
        console.log("up", room.config.player2[1])
        room.config.player2[1] += room.config.playerSpeed
      }
      if (room.config.ballPos[1] < room.config.player2[1])
      {
        console.log("down", room.config.player2[1])
        room.config.player2[1] -= room.config.playerSpeed
      }
      this.server.to(room.code.toString()).emit('players', {ratio: room.config.player2[1] / 100, player: 0, admin: false, room: room})
    }
  }

  findRoom(id: number) {
    const roomIterator = this.rooms.values()
    let i = 0;
    let value: Room;
    while (i < this.rooms.size)
    {
      value = roomIterator.next().value;
      if (value.code == id)
       return value;
      i++
    }
     return undefined
  }

  createRoom(codeRoom: number, playerID: number, nbplayer: number) {
    let mode = 2
    console.log(nbplayer);
    if (nbplayer == 1)
      mode = 1;
    const room: Room = {
      code : codeRoom,
      state: State.WAITING,
      mode: mode,
      players: [playerID, 0],
      spectators: [],
      config: this.initConfig(),
    };
    this.rooms.set(codeRoom, room);
    return room;
  }

  initConfig(){
    let sizeBallExt = 3;
    let config: Config = {
      ballPos: [50 - (sizeBallExt / 2), 50],
      player1: [100 - sizeBallExt, 50],
      player2: [0, 50],
      sizeBall:  sizeBallExt,
      speed: 0.5,
      playerSize: sizeBallExt * 4,
      playerSpeed: 10,
      middle: 50 + (sizeBallExt / 4),
      vector: [1, 0],
      p1Score: 0,
      p2Score: 0,
      baseSpeed: 0.5
    }
    return config;
  }

  @Interval(1000 / 60)
  handleInterval(): void {
    for (const room of this.rooms.values())
    {
      if (room.mode == 1)
        this.botmove(room);
      this.routine(room);;
    }
  }

  startGame(room: Room): void {
    if (room.state == State.WAITING && ((room.players[0] != 0 && room.players[1] != 0) || room.mode == 1))
    {
      room.state = State.INGAME;
    }
    if (room.state == State.INGAME)
    {
      this.server.to(room.code.toString()).emit("Start", {room: room});
      // this.server.to(room.code.toString()).emit('players', {ratio: room.config.player1[1] / 100, player: room.players[0], admin: true, room: room})
      // this.server.to(room.code.toString()).emit('players', {ratio: room.config.player2[1] / 100, player: room.players[1], admin: false, room: room})
    }
  }

  routine(room: Room): void {
    if (room.state == State.INGAME)
      this.update(room);
  }

  update(room: Room): any {
    // ======== New position Ball ============
    let newPos = 0;
    room.config.ballPos = [room.config.ballPos[0] + (room.config.vector[0] * room.config.speed), room.config.ballPos[1] + (room.config.vector[1]  * room.config.speed)]
    if (room.config.ballPos[1] + (room.config.sizeBall / 2) >= 100) {
      newPos = 100 - (room.config.sizeBall / 2)
      room.config.vector = [room.config.vector[0], -room.config.vector[1]]
      room.config.ballPos = [room.config.ballPos[0], newPos]
    }
    if (room.config.ballPos[1] - (room.config.sizeBall / 2) < 0) {
      newPos = (0 + (room.config.sizeBall / 2))
      room.config.vector = [room.config.vector[0], -room.config.vector[1]]
      room.config.ballPos = [room.config.ballPos[0], newPos]
    }
    if (room.config.ballPos[0] + room.config.sizeBall / 2 >= room.config.player1[0]) {
  		if (room.config.ballPos[1] >= room.config.player1[1] && room.config.ballPos[1] <= room.config.player1[1] + room.config.sizeBall * 4) {
  			let percent = Math.floor((room.config.ballPos[1] - room.config.player1[1]) / ((room.config.player1[1] + room.config.sizeBall * 4) - room.config.player1[1]) * 100)
  			if (percent <= 20) {
  				room.config.vector = [-0.5, -Math.sqrt(3) / 2];
  			}
  			else if (percent <= 40) {
  				room.config.vector = [-Math.sqrt(3) / 2, -0.5];
  			}
  			else if (percent <= 60) {
  				room.config.vector = [-1, 0];
  			}
  			else if (percent <= 80) {
  				room.config.vector = [-Math.sqrt(3) / 2, 0.5];
  			}
  			else {
  				room.config.vector = [-0.5, Math.sqrt(3) / 2];
  			}
        room.config.speed = room.config.speed + 0.1 ;
  		}
  		else {
  			room.config.ballPos = [50, 50]
  			room.config.speed = room.config.baseSpeed
        room.config.p2Score++;
        this.server.to(room.code.toString()).emit('newPoint', room)
  		}
  	}
  	if (room.config.ballPos[0] <= room.config.player2[0] + room.config.sizeBall * 1.5)
  	{
  		if (room.config.ballPos[1] >= room.config.player2[1] && room.config.ballPos[1] <= room.config.player2[1] + room.config.sizeBall * 4) {
  			let percent = Math.floor((room.config.ballPos[1] - room.config.player2[1]) / ((room.config.player2[1] + room.config.sizeBall * 4) - room.config.player2[1]) * 100)
  			if (percent <= 20) {
  				room.config.vector = [0.5, -Math.sqrt(3) / 2];
  			}
  			else if (percent <= 40) {
  				room.config.vector = [Math.sqrt(3) / 2, -0.5];
  			}
  			else if (percent <= 60) {
  				room.config.vector = [1, 0];
  			}
  			else if (percent <= 80) {
  				room.config.vector = [Math.sqrt(3) / 2, 0.5];
  			}
  			else {
  				room.config.vector = [0.5, Math.sqrt(3) / 2];
  			}
        room.config.speed = room.config.speed + 0.1 ;
  		}
  		else {
  			room.config.ballPos = [50, 50]
  			room.config.speed = room.config.baseSpeed
        room.config.p1Score++;
        this.server.to(room.code.toString()).emit('newPoint', room)
  		}
  	}
   this.server.to(room.code.toString()).emit('ballMoved', room)


   //=========== EndGame  ==========
   if (room.config.p1Score > 2 || room.config.p2Score > 2)
   {
     this.partiesService.remove(room.code.toString());
     if (room.mode == 2)
     {
       this.partiesService.createHistories({
         user_one_id: room.players[0].toString(),
         user_two_id: room.players[1].toString(),
         score_one: room.config.p1Score,
         score_two: room.config.p2Score
       })
       if (room.config.p1Score < room.config.p2Score)
       {
         this.userService.updateScore(room.players[0].toString(), false)
         this.userService.updateScore(room.players[1].toString(), true)
       }
       else
       {
         this.userService.updateScore(room.players[0].toString(), true)
         this.userService.updateScore(room.players[1].toString(), false)
       }
     }
     this.rooms.delete(room.code)
     this.server.to(room.code.toString()).emit('gameoverSend', room)
   }
 }

}
