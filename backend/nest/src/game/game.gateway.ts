import { OnModuleInit } from '@nestjs/common';
import {
 SubscribeMessage,
 WebSocketGateway,
 WebSocketServer,
 MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PartiesService } from '../parties/parties.service';
// import { ChanService } from '../chans/chan.service';
import { UserService } from '../user/user.service';
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
      this.server.to(body.game.id).emit("userJoinChannel", body.game);
    }
    else if (body.game.p1 !== null && body.game.p1 !== body.auth_id && body.game.p2 === null)
    {
      body.game.p2 = body.auth_id
      console.log("P2 OK")
      const settings = await this.gameService.initGame(body.game.p1, body.game.p2)
      console.log("Settings : ", settings)
      this.server.to(body.game.id).emit("Init", {room: body.game, settings: settings});
      for (let i = 5; i > 0; i--)
        this.server.to(body.game.id).emit("printCountDown", {room: body.game, number: i});
      this.server.to(body.game.id).emit("Start", {room: body.game});
    }
    if (body.game.p1 !== null && body.game.p1 !== body.auth_id && body.game.p2 !== null && body.game.p1 !== body.auth_id)
    {
      this.server.to(body.game.id).emit("Init", {room: body.game, settings: settings});
      this.server.to(body.game.id).emit("Start", {room: body.game});
    }
  }

  @SubscribeMessage('barMove')
  onNewMessage(@MessageBody() body: any) {
    this.server.to(body.room).emit('players', {ratio: body.ratio, player: body.player, fromAdmin: body.fromAdmin, room: body.room})
  }

  @SubscribeMessage('pleaseBall')
  onBallMove(@MessageBody() body: any) {
    this.server.to(body.room).emit('ballMoved', body)
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
