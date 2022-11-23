import {BadRequestException, OnModuleInit} from '@nestjs/common';
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
  withCredentials: true,
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
  async onNewMessage(client: Socket, @MessageBody() body: any) {
    //console.log(body);
      //console.log('sending new message from ', body.username);
      const sender: UserEntity = await this.userService.findOnebyUsername(body.username);
      if (!sender) {
          client.emit('error', {statusCode: 400, message: 'Error while sending a new message: Cant find sender'});
          return ;
          //throw new WsException('Error while sending a new message: Cant find sender');
      }
        //console.log('user found hihih ');
      const chan: ChanEntity = await this.chanService.findOnebyID(body.room);
      if (!chan) {
          client.emit('error', {statusCode: 400, message: 'Error while sending a new message: Cant find room'});
            return ;
          //throw new WsException('Error while sending a new message: Cant find room');
      }
      if (chan.chanUser.find(elem => elem === sender)) {
          client.emit('error', {statusCode: 400, message: 'Error while sending a new message: User not in chat'});
            return ;
          //throw new WsException('Error while sending a new message: User not in chat');
      }
      //console.log('user is present in chat hiihih');
      if (chan.muteUser.find(elem => elem === sender)) {
          client.emit('error', {statusCode: 400, message: 'Message not sent: User had been muted'});
          return ;
      }


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
  	const usr: UserEntity = await this.userService.findOneByAuthId(body[1])
      if (!usr) {
          client.emit('error', {statusCode: 400, message: 'Error while joining room: Cant find user'});
            return ;
          //throw new BadRequestException('Error while joining room: Cant find user');
      }
      console.log('client handshake header = ', client.handshake.headers);

      try {
          await this.chanService.addUserToChannel(usr, body[0])
      } catch (error) {
          client.emit('error', {statusCode: error.statusCode, message: error.message});
            return ;
      }
  	client.emit('joinedRoom', body[0]);
  	this.server.to(body[0]).emit("userJoinChannel");
  }

  @SubscribeMessage('addToChannel')
  async onAddTochannel(client: Socket, body: {room: string, auth_id: string}) {
     try {
         const usr = await this.userService.findOneByAuthId(body.auth_id)
         if (!usr) {
             client.emit('error', {statusCode: 400, message: 'Error while adding new channel: Cant find user'})
            return ;
         }
         await this.chanService.addUserToChannel(usr, body.room)
         client.emit('joinedRoom', body.room);
         this.server.to(body.room).emit("userJoinChannel");
     } catch (error) {
         client.emit('error', {statusCode: error.statusCode, message: error.message});
         return ;
         //throw new WsException(error);
     }
  }

  launchCounterBan(client: Socket, auth_id: string, room: string) {
        console.log('lets gooooooo');
        setTimeout(async () => {
            try {
                await this.chanService.banUserToChannel(auth_id, room, false)
            } catch (error) {
                client.emit('error', {statusCode: error.statusCode, message: error.message});
                return;
            }
            console.log('go unban lelele')
        }, 10000)
  }

    launchCounterMute(client: Socket, auth_id: string, room: string) {
        console.log('lets gooooooo');
        setTimeout(async () => {
            try {
                await this.chanService.muteUserToChannel(auth_id, room, false)
            } catch (error) {
                client.emit('error', {statusCode: error.statusCode, message: error.message});
                return ;
            }
            console.log('go unmute lelele')
        }, 10000)
    }

    @SubscribeMessage('banToChannel')
    async banUserToChannel(client: Socket, body: {room: string, auth_id: string, action: boolean}) {
        //console.log('banUserToChan');
        try {
            //const usr = await this.userService.findOneByAuthId(body.auth_id)
            await this.chanService.banUserToChannel(body.auth_id, body.room, body.action)
            client.emit('banRoom');
            this.server.to(body.room).emit("bannedChannel", {auth_id: body.auth_id, status: body.action});
            if (body.action === true)
                this.launchCounterBan(client, body.auth_id, body.room);
        } catch (error) {
            client.emit('error', {statusCode: error.statusCode, message: error.message});
            //throw new WsException(error);
        }
    }

    @SubscribeMessage('muteToChannel')
    async mutenUserToChannel(client: Socket, body: {room: string, auth_id: string, action: boolean}) {
        try {
            //const usr = await this.userService.findOneByAuthId(body.auth_id)
            await this.chanService.muteUserToChannel(body.auth_id, body.room, body.action)
            client.emit('muteRoom');
            console.log('body room = ', body.room);
            this.server.to(body.room).emit("mutedChannel", {auth_id: body.auth_id, status: body.action});
            if (body.action === true) {
                this.launchCounterMute(client, body.auth_id, body.room);
            }
        } catch (error) {
            client.emit('error', {statusCode: error.statusCode, message: error.message});
            return ;
           // throw new WsException(error);
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

  /*
  //@SubscribeMessage('isMuted')
    async checkIfMuted(client: Socket, iduser: string, idroom: string) {
        console.log('booom checkos');
        const chan: ChanEntity = await this.chanService.findOnebyID(idroom);
        if (!chan) {
            client.emit('error', {statusCode: 400, message: 'Error while checking if user is muted: Cant find chan'})
            return ;
            //throw new WsException('Error while checking if user is muted: Cant find chan')
        }
        console.log('chan ok ');
        const user: UserEntity = await this.userService.findOneByAuthId(iduser)
        if (!user) {
            client.emit('error', {statusCode: 400, message: 'Error while checking if user is muted: Cant find chan'});
            return ;
            //throw new WsException('Error while checking if user is muted: Cant find chan')
        }
        console.log('user ok');
        console.log('list of muted users : ', chan.muteUser);
      const response = !!chan.muteUser.findIndex(obj => {
            return obj.auth_id === user.auth_id
        });
      console.log('response = ', response);
      const event = 'isMuted';
      client.emit(event, response);
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
   */
}
