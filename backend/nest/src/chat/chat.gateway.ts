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
import ChanEntity from "../chans/entities/chan-entity";

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
      console.log('sending new message from ', body.username);
      const sender: UserEntity = await this.userService.findOnebyUsername(body.username);
      if (!sender) {
          throw new WsException('Error while sending a new message: Cant find sender');
      }
        console.log('user found hihih ');
      const chan: ChanEntity = await this.chanService.findOnebyID(body.room);
      if (!chan) {
          throw new WsException('Error while sending a new message: Cant find room');
      }
      if (chan.chanUser.find(elem => elem === sender)) {
          throw new WsException('Error while sending a new message: User not in chat');
      }
      console.log('user is present in chat hiihih');
      /*
      if (chan.muteUser.find(elem => elem === sender)) {
          body.message = 'Message not sent: User had been muted';
      }
       */
      console.log('user is not muted hihihihi');
      this.checkIfBanned(body[1], body[0]);
      this.checkIfMuted(body[1], body[0])

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
  async onJoinRoom(
    client: Socket,
    body: string[] /* room: string, auth_id: string */,
  ) {
  	client.join(body[0]);
  	const usr = await this.userService.findOneByAuthId(body[1])
  	await this.chanService.addUserToChannel(usr, body[0])
  	client.emit('joinedRoom', body[0]);
      this.checkIfBanned(body[1], body[0]);
      this.checkIfMuted(body[1], body[0])
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
        //console.log('banUserToChan');
        try {
            //const usr = await this.userService.findOneByAuthId(body.auth_id)
            await this.chanService.banUserToChannel(body.auth_id, body.room, body.action)
            client.emit('banRoom', body.room);
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
            client.emit('muteRoom', 'prout');
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

  //@SubscribeMessage('isMuted')
    async checkIfMuted(iduser: string, idroom: string) {
        console.log('booom checkos');
        const chan: ChanEntity = await this.chanService.findOnebyID(idroom);
        if (!chan) {
            throw new WsException('Error while checking if user is muted: Cant find chan')
        }
        console.log('chan ok ');
        const user: UserEntity = await this.userService.findOneByAuthId(iduser)
        if (!user) {
            throw new WsException('Error while checking if user is muted: Cant find chan')
        }
        console.log('user ok');
        console.log('list of muted users : ', chan.muteUser);
      const response = !!chan.muteUser.findIndex(obj => {
            return obj.auth_id === user.auth_id
        });
      const event = 'isMuted';
      this.server.to(idroom).emit(event, response);
  }

  //@SubscribeMessage('isBanned')
    async checkIfBanned(iduser: string, idroom: string) {
      const chan: ChanEntity = await this.chanService.findOnebyID(idroom);
      if (!chan) {
          throw new WsException('Error while checking if user is banned: Cant find chan')
      }
      const user: UserEntity = await this.userService.findOneByAuthId(iduser)
      if (!user) {
          throw new WsException('Error while checking if user is banned: Cant find user')
      }
      const event = 'isBanned';
      const response = chan.banUser.findIndex(obj => {
          return obj.auth_id === user.auth_id
      })
      this.server.to(idroom).emit(event, response);
      //this.server.to(body.room).emit("bannedChannel");

  }
}
