import {NotFoundException, OnModuleInit} from '@nestjs/common';
import {
 SubscribeMessage,
 WebSocketGateway,
 WebSocketServer
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import UserEntity from "../user/entities/user-entity";

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080'],
  },
  namespace: '/update',
})
export class UpdateGateway implements OnModuleInit
{
  constructor(
      private readonly userService: UserService,
  ) {}

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
  onUpdateUser(client: Socket, user: { auth_id: number, status: number }): void {
	this.server.emit('onUpdateUser', user);
  }

  @SubscribeMessage('updateFriend')
  async onUpdateFriend(client: Socket, obj: { curid: string, frid: string, action: boolean }) {
    const curuser: UserEntity = await this.userService.findOneByAuthId(obj.curid)
    if (!curuser) {
      throw new NotFoundException('Error while adding friend: Cant find current user')
    }
    try {
      const friuser: UserEntity = await this.userService.updateFriends(obj.action, obj.curid, obj.frid);
      this.server.emit('onUpdateFriend', {
        "curuser": curuser,
        "friuser": friuser,
        "action": obj.action
      })
    } catch (error) {
      this.server.emit('error', {
            statusCode: error.statusCode,
            message: error.message
          },
          obj.curid,
      )
    }
  }

  @SubscribeMessage('updateBlocked')
  async onUpdateBlocked(client: Socket, obj: { curid: string, bloid: string, action: boolean }) {
    try {
      const user: UserEntity = await this.userService.updateBlocked(obj.action, obj.bloid, obj.curid);
      this.server.emit('onUpdateBlocked', {
        "user": user,
        "action": obj.action,
      },
          obj.curid);
    } catch (error) {
      this.server.emit('error', {
            statusCode: error.statusCode,
            message: error.message
          },
          obj.curid,
      )
    }
  }

  @SubscribeMessage('userCreation')
  onUpdateConnection(client: Socket, user: UserEntity) {
    this.server.emit('onUserCreation', user);
  }
}

//   @SubscribeMessage('barMove')
//   onNewMessage(@MessageBody() body: any) {
//     // console.log(this.server.)
//     this.server.to(body.room).emit('player2', {ratio: body.ratio, player: body.player, fromAdmin: body.fromAdmin, room: body.room})
// 	}
