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
import { Room, State, Position } from './room.interface';
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
    private readonly partiesService: PartiesService) {}


  rooms: Map<string, Room> = new Map();

  // @Interval(1000)
  //  loop(): void {
  //    console.log("test")
  //    for (const room of this.rooms.values())
  //    {
  //      console.log(room.code);
  //      if (room.state == State.INGAME)
  //      {
  //        console.log(room.code);
  //      }
  //    }
  //  }

  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {
    });
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(client: Socket, body: any) {
    console.log("JOINROOM == ", body.game.id)
    client.join(body.game.id);
    this.partiesService.addToGame(body.game.id, body.auth_id);
    if (body.game.p1 === null)
    {
      body.game.p1 = body.auth_id;
      this.createRoom(body.game.id);
      this.server.to(body.game.id).emit("userJoinChannel", body.game);
    }
    else if (body.game.p1 !== null && body.game.p1 !== body.auth_id && body.game.p2 === null)
    {
      body.game.p2 = body.auth_id
      const settings = await this.gameService.initGame(body.game.p1, body.game.p2)
      this.server.to(body.game.id).emit("Init", {room: body.game, settings: settings});
      for (let i = 5; i > 0; i--)
        this.server.to(body.game.id).emit("printCountDown", {room: body.game, number: i});
      this.server.to(body.game.id).emit("Start", {room: body.game});
      this.startGame(this.getRoom(body.game.id))
    }
    else
    // if (body.game.p1 !== null && body.game.p2 !== null)
    {
      const settings = await this.gameService.initGame(body.game.p1, body.game.p2)
      if (body.game.p2 !== body.game.id && body.game.p1 !== body.game.id)
      {
        this.server.to(body.game.id).emit("Init", {room: body.game, settings: settings});
        this.server.to(body.game.id).emit("Start", {room: body.game});
      }
      this.update(body.game.id);
    }
  }

  @SubscribeMessage('barMove')
  onNewMessage(@MessageBody() body: any) {
    let admin: boolean
    if (body.player === body.p1)
      admin = true
    else if (body.player === body.p2)
      admin = false
    this.server.to(body.room).emit('players', {ratio: body.ratio, player: body.player, admin: admin, room: body.room})
  }

  @SubscribeMessage('pleaseBall')
  onBallMove(@MessageBody() body: any) {
    this.server.to(body.room).emit('ballMoved', body)
  }

   getRoom(code: string): Room {
     return this.rooms.get(code);
   }

   createRoom(code: string = null): Room {
     while (!code) {
       const length = 10;
       const generated = Math.floor(
         Math.random() * Math.pow(16, length),
       ).toString(16);
       if (!this.rooms.has(generated)) code = generated;
     }

     const room: Room = {
       code,
       state: State.WAITING,
       players: [],
       ball: { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } },
       speed: 0,
     };
     this.rooms.set(code, room);
     return room;
   }

   startGame(room: Room): void {
     console.log("pretty")
     // ================ init Game ==============
     room.state = State.INGAME;
     this.update(room);

   }

  update(room: Room): any {
    console.log("works")
    // ======== New position Ball ============

   // =============== scores ================

   //=========== EndGame ? ==========

   //============ Reset Ball Pos ============


   //====== Envoyer position ball =========
   // setTimeout(() => {}, 1000)
   // this.update(room)
 }


  @SubscribeMessage('gameover')
  gameOver(@MessageBody() body: any) {
    this.server.to(body.room).emit('gameoverSend', body)
  }


}
