import { OnModuleInit } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    MessageBody, WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChanService } from '../chans/chan.service';
import { UserService } from '../user/user.service';
import UserEntity from "../user/entities/user-entity";

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080'],
  },
  namespace: '/chat',
})
export class ChatGateway implements OnModuleInit
{
	constructor(private readonly chanService: ChanService, private readonly userService: UserService) {}

  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {
      //console.log(socket.id);
      //console.log("Connected");
    });
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(@MessageBody() body: any) {
    //console.log(body);
      /*
      const sender: UserEntity = await this.userService.findOnebyUsername(body.username);
      if (!sender) {
          throw new WsException('Error while sending a new message: Cant find sender');
      }
      if (body.room.chanUser.find(elem => elem === sender)) {
          throw new WsException('Error while sending a new message: User not in chat');
      }
      if (body.room.muteUser.find(elem => elem === sender)) {
          body.message = 'Message not sent: User had been muted';
      }
       */

    this.server.to(body.room).emit('onMessage', {
      msg: 'New Message',
      content: body.chat,
      sender_socket_id: body.sender_socket_id,
      username: body.username,
      avatar: body.avatar,
	  room: body.room
    })
	this.chanService.addMessage({
		content: body.chat,
		sender_socket_id: body.sender_socket_id,
		username: body.username,
		avatar: body.avatar,
		room: body.room
	})
}

  @SubscribeMessage('joinRoom')
  async onJoinRoom(client: Socket, body: string[]/* room: string, auth_id: string */) {
  	client.join(body[0]);
  	const usr = await this.userService.findOneByAuthId(body[1])
  	await this.chanService.addUserToChannel(usr, body[0])
  	client.emit('joinedRoom', body[0]);
  	this.server.to(body[0]).emit("userJoinChannel");
  }

  @SubscribeMessage('addToChannel')
  async onAddTochannel(client: Socket, body: {room: string, auth_id: string}) {
     try {
         const usr = await this.userService.findOneByAuthId(body.auth_id)
         await this.chanService.addUserToChannel(usr, body.room)
         client.emit('joinedRoom', body.room);
         this.server.to(body.room).emit("userJoinChannel");
     } catch (error) {
         throw new WsException(error);
     }
  }

    @SubscribeMessage('banToChannel')
    async banUserToChannel(client: Socket, body: {room: string, auth_id: string, action: boolean}) {
        console.log('banUserToChan');
        try {
            //const usr = await this.userService.findOneByAuthId(body.auth_id)
            await this.chanService.banUserToChannel(body.auth_id, body.room, body.action)
            client.emit('leaveRoom', body.room);
            this.server.to(body.room).emit("bannedChannel");
        } catch (error) {
            throw new WsException(error);
        }
    }


    @SubscribeMessage('muteToChannel')
    async mutenUserToChannel(client: Socket, body: {room: string, auth_id: string, action: boolean}) {
        try {
            //const usr = await this.userService.findOneByAuthId(body.auth_id)
            await this.chanService.muteUserToChannel(body.auth_id, body.room, body.action)
            client.emit('muteRoom', body.room);
            this.server.to(body.room).emit("mutedChannel");
        } catch (error) {
            throw new WsException(error);
        }
    }

    @SubscribeMessage('leaveRoom')
  onLeaveRoom(client: Socket, room: string) {
  	client.join(room);
  	client.emit('leftRoom', room);
  }

  @SubscribeMessage('chanCreated')
  onChanCreated() {
  	this.server.emit('newChan');
  }

  @SubscribeMessage('newParty')
  onNewParty(client: Socket) {
	this.server.emit('onNewParty');
  }

  @SubscribeMessage('updateUser')
  onUpdateUser(client: Socket, user : {auth_id: number, status: number}) {
	this.server.emit('onUpdateUser', user);
  }
}
