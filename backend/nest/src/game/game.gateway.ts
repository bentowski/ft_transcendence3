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
// import { ChanService } from '../chans/chan.service';
import { UserService } from '../user/user.service';
import { Room, State, Config } from './room.interface';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080'],
  },
  namespace: '/game',
})
export class GameGateway implements OnModuleInit
 //implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
    private readonly gameService: GameService,
    private readonly partiesService: PartiesService
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
       currentRoom = this.createRoom(body.game.id, body.auth_id);
     }
     else if (currentRoom.players[1] == 0
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
        console.log("Spectator")
      }
    if (currentRoom != undefined)
    {
      this.partiesService.addToGame(body.game.id, body.auth_id);
      this.server.to(body.game.id).emit("Init", {room: body.game, settings: currentRoom.config});
      if (currentRoom.players[0] && currentRoom.players[1])
        this.startGame(currentRoom, body.game);
    }
   }


  @SubscribeMessage('barMove')
  onNewMessage(@MessageBody() body: any) {
    let admin: boolean
    let currentRoom: Room|undefined = this.findRoom(body.game.id);
    if (currentRoom != undefined)
    {
      if (body.player === currentRoom.players[0])
        admin = true
      else if (body.player === currentRoom.players[1])
        admin = false
      this.server.to(body.room).emit('players', {ratio: body.ratio, player: body.player, admin: admin, room: body.room})
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

  createRoom(codeRoom: number, playerID: number) {
      const room: Room = {
        code : codeRoom,
        state: State.WAITING,
        mode: 0,
        players: [playerID, 0],
        spectators: [],
        config: this.initConfig(),
      };
      this.rooms.set(codeRoom, room);
      return room;
  }

  initConfig(){
    let sizeBall = 3;
    let config: Config = {
      ballPos: [50 - (sizeBall / 2), 50],
      player1: [100 - sizeBall, 50],
      player2: [0, 50],
      sizeBall:  sizeBall,
      speed: 10,
      playerSize: sizeBall * 4,
      playerSpeed: 10,
      middle: 50 + (sizeBall / 4),
      vector: [1, 0],
      p1Score: 0,
      p2Score: 0
    }
    return config;
  }

  startGame(room: Room, prout: any): void {
    console.log("pretty")

    // while (!(room.state = State.WAITING && room.players[0] != 0 && room.players[1] != 0));
    room.state = State.INGAME;
    for (let i = 5; i > 0; i--)
      this.server.to(prout.id).emit("printCountDown", {room: prout, number: i});
    if (room.state = State.INGAME)
    {
      this.routine();
    }
  }

   routine(): void {
     for (const room of this.rooms.values())
       if (room.state == State.INGAME)
         this.update(room)
     setTimeout(() => {this.routine()}, (1000 / 60))
   }

    update(room: Room): any {
      console.log("routine");
      // ======== New position Ball ============

     // =============== scores ================

     //=========== EndGame ? ==========

     //============ Reset Ball Pos ============


     //====== Envoyer position ball =========

   }

 //  @SubscribeMessage('pleaseBall')
 //  onBallMove(@MessageBody() body: any) {
 //    this.server.to(body.room).emit('ballMoved', body)
 //  }
 //
 //
 //

 //

 //

 //
 //
 //  @SubscribeMessage('gameover')
 //  gameOver(@MessageBody() body: any) {
 //    this.server.to(body.room).emit('gameoverSend', body)
 //  }


}
