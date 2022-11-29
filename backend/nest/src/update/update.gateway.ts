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
    origin: ['http://localhost:8080'],
  },
  namespace: '/update',
})
export class UpdateGateway implements OnModuleInit
 //implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {});
  }

  @SubscribeMessage('newParty')
  onNewParty(client: Socket) {
	this.server.emit('onNewParty');
  }

  @SubscribeMessage('askForGameUp')
  onAskForGameUp(client: Socket, body: {"to": string, "from": string}): void {
	  this.server.emit('onAskForGameUp', body);
  }

  @SubscribeMessage('askForGamedown')
  onAskForGameDown(client: Socket, body: {"to": string, "from": string}): void {
    this.server.emit('onAskForGameDown', body);
  }

  @SubscribeMessage('inviteAccepted')
  onInviteAccepted(client: Socket, body: {"to": string, "from": string, "partyID": string}): void {
	  this.server.emit('onInviteAccepted', body);
  }

  @SubscribeMessage('inviteDeclined')
  onInviteDeclined(client: Socket, body: {"to": string, "from": string}): void {
	  this.server.emit('onInviteDeclined', body);
  }

  @SubscribeMessage('updateUser')
  onUpdateUser(client: Socket, user: { auth_id: number; status: number }): void {
	this.server.emit('onUpdateUser', user);
  }

//   @SubscribeMessage('barMove')
//   onNewMessage(@MessageBody() body: any) {
//     // console.log(this.server.)
//     this.server.to(body.room).emit('player2', {ratio: body.ratio, player: body.player, fromAdmin: body.fromAdmin, room: body.room})
// 	}
}
