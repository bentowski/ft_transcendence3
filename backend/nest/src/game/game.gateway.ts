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

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080/game'],
  },
  namespace: '/game',
})
export class GameGateway implements OnModuleInit
 //implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private readonly partiesService: PartiesService) {}

  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {
      //console.log("Game : ");
      //console.log(socket.id);
      //console.log("Connected");
      //console.log("======= FIN =========");
    });
  }

  @SubscribeMessage('barMove')
  onNewMessage(@MessageBody() body: any) {
    // console.log(this.server.)
    this.server.to(body.room).emit('player2', {ratio: body.ratio, player: body.player, fromAdmin: body.fromAdmin, room: body.room})
}

  @SubscribeMessage('joinRoom')
  async onJoinRoom(client: Socket, body: any) {
	client.join(body.game.id);
  // console.log(this.server.rooms)
  this.partiesService.addToGame(body.game.id, body.auth_id);
	// client.emit('joinedRoom', body.game);
  if (body.game.p1 === null)
    body.game.p1 = body.auth_id;
  else if (body.game.p1 !== null && body.game.p1 !== body.auth_id && body.game.p2 === null)
    body.game.p2 = body.auth_id
	this.server.to(body.game.id).emit("userJoinChannel", body.game);
  }

  @SubscribeMessage('moveBall')
  onBallMove(@MessageBody() body: any) {
    this.server.to(body.room).emit('ballMoved', body)
  }
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
