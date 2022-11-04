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
      console.log("Game : ");
      console.log(socket.id);
      console.log("Connected");
      console.log("======= FIN =========");
    });
  }

  @SubscribeMessage('barMove')
  onNewMessage(@MessageBody() body: any) {
    // console.log(this.server.)
    this.server.to(body.room).emit('player2', {ratio: body.ratio, player: body.player, fromAdmin: body.fromAdmin, room: body.room})
}

  @SubscribeMessage('joinRoom')
  async onJoinRoom(client: Socket, body: string[]/* room: string, auth_id: string */) {
	client.join(body[0]);
  // console.log(this.server.rooms)
  this.partiesService.addToGame(body[0], body[1]);
	client.emit('joinedRoom', body[0]);
	this.server.to(body[0]).emit("userJoinChannel");
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
