import { OnModuleInit } from '@nestjs/common';
import {
 SubscribeMessage,
 WebSocketGateway,
 WebSocketServer,
 MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChanService } from '../chans/chan.service';
import { UserService } from '../user/user.service';

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
  onNewMessage(@MessageBody() body: any) {
    //console.log(body);
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
  	const usr = await this.userService.findOneByAuthId(body.auth_id)
  	await this.chanService.addUserToChannel(usr, body.room)
  	client.emit('joinedRoom', body.room);
  	this.server.to(body.room).emit("userJoinChannel");
  }

    @SubscribeMessage('banToChannel')
    async banUserToChannel(client: Socket, body: {room: string, auth_id: string}) {
        const usr = await this.userService.findOneByAuthId(body.auth_id)
        await this.chanService.banUserToChannel(usr, body.room)
        client.emit('leaveRoom', body.room);
        this.server.to(body.room).emit("bannedChannel");
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
