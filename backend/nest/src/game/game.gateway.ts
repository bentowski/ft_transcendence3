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


  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {
    });
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(client: Socket, body: any) {
    console.log("JOINROOM")
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
    if (body.game.p1 !== null && body.game.p1 !== body.auth_id && body.game.p2 !== null && body.game.p1 !== body.auth_id)
    {
      const settings = await this.gameService.initGame(body.game.p1, body.game.p2)
      this.server.to(body.game.id).emit("Init", {room: body.game, settings: settings});
      this.server.to(body.game.id).emit("Start", {room: body.game});
    }
  }

  @SubscribeMessage('barMove')
  onNewMessage(@MessageBody() body: any) {
    console.log("AAAAAAA", body)
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

  @Interval(1000)
   loop(): void {
     for (const room of this.rooms.values())
       if (room.state == State.INGAME)
       {
         console.log(room.code);
       }
        // this.pong.update(room);
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
     if (room.state != State.STARTING) return;
     // this.resetBall(room);
     room.state = State.INGAME;
     this.update(room);
     // room.state = State.COUNTDOWN;
     // RoomService.emit(
     //   room,
     //   'ready',
     //   // room.options,
     //   room.user.map((player) => player.user),
     // );
   }

   // resetBall(room: Room, left?: boolean): void {
   //    let radian = (Math.random() * Math.PI) / 2 - Math.PI / 4;
   //    if (left) radian += Math.PI;
   //
   //    //remettre settings de base
   //
   //    // this.updateBall(
   //    //   50, //- (sizeBall / 2),
   //    //   50,
   //    //   radian,
   //    //   room,
   //    // );
   //  }

  // updateBall(x: number, y: number, radian: number, room: Room): void {
  //   room.ball.position.x = x;
  //   room.ball.position.y = y;
  //   room.ball.velocity = this.velocity((room.speed *= 1.01), radian);
  //   //envoyer position ball
  // }

  // velocity = (speed: number, radian: number): Position => {
  //   return { x: Math.cos(radian) * speed, y: Math.sin(radian) * speed };
  // };

  update(room: Room): any {
    // ======== New position Ball ============

   // =============== scores ================

  //=========== EndGame ? ==========

  //============ Reset Ball Pos ============


   //====== Envoyer position ball =========
 }

 stopGame()
 {
   //emit endGame
 }


  // @SubscribeMessage('gameover')
  // gameOver(@MessageBody() body: any) {
  //   this.server.to(body.room).emit('gameoverSend', body)
  // }
  //
  // @SubscribeMessage('endGame')
  // onEndGame(client: Socket, room: string) {
  //   console.log("end game !")
  //   this.server.to(room).emit('onEndGame', room)
  //   this.partiesService.remove(room)
  // }
//   @SubscribeMessage('leaveRoom')
//   onLeaveRoom(client: Socket, room: string) {
// 	client.join(room);
// 	client.emit('leftRoom', room);
//   }
//
//   @SubscribeMessage('chanCreated')
//   onChanCreated() {
// 	this.server.emit('newChan');
//   }
}
