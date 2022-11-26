import {OnModuleInit} from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChanService } from '../chans/chan.service';
import { UserService } from '../user/user.service';
import UserEntity from '../user/entities/user-entity';
import ChanEntity from '../chans/entities/chan-entity';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080'],
  },
  namespace: '/chat',
})
export class ChatGateway implements OnModuleInit
{
  constructor(
    private readonly chanService: ChanService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      //console.log(socket.id);
      //console.log("Connected");
    });
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(client: Socket, @MessageBody() body: any) {
      const sender: UserEntity = await this.userService.findOnebyUsername(body.username);
      if (!sender) {
          this.server
              .to(body.room)
              .emit(
                  'error',
                  {
                      statusCode: 404,
                      message: 'Error while sending a new message: Cant find sender'
                  },
                  body.auth_id
              );
          return ;
      }
      const chan: ChanEntity = await this.chanService.findOnebyID(body.room);
      if (!chan) {
          this.server
              .to(body.room)
              .emit(
                  'error',
                  {
                      statusCode: 404,
                      message: 'Error while sending a new message: Cant find room'
                  },
                  body.auth_id
              );
            return ;
      }
      if (chan.chanUser.find(elem => elem === sender)) {
          this.server
              .to(body.room)
              .emit(
                  'error',
                  {
                      statusCode: 452,
                      message: 'Error while sending a new message: User not in chat'
                  },
                  body.auth_id
              );
            return ;
      }
      const mfound = chan.muteUser.find(elem => elem.auth_id === sender.auth_id)
      if (mfound) {
          this.server
              .to(body.room)
              .emit(
                  'error',
                  {
                      statusCode: 451,
                      message: 'Message not sent: User had been muted'
                  },
                  body.auth_id
              );
          return ;
      }
      const bfound = chan.banUser.find(elem => elem.auth_id === sender.auth_id);
      if (bfound) {
          this.server
              .to(body.room)
              .emit(
                  'error',
                  {
                      statusCode: 450,
                      message: 'Message not sent: User had been banned'},
                  body.auth_id
              );
          return ;
      }

    this.server
        .to(body.room)
        .emit('onMessage', {
      msg: 'New Message',
      content: body.chat,
      sender_socket_id: body.sender_socket_id,
      username: body.username,
      avatar: body.avatar,
      auth_id: body.auth_id,
	  room: body.room
    });
	await this.chanService.addMessage({
		content: body.chat,
		sender_socket_id: body.sender_socket_id,
		username: body.username,
		avatar: body.avatar,
        auth_id: body.auth_id,
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
          this.server
              .to(body[0])
              .emit(
                  'error',
                  {
                      statusCode: 404,
                      message: 'Error while joining room: Cant find user'
                  },
                  body[1]
              );
            return ;
      }
      try {
          await this.chanService.addUserToChannel(usr, body[0])
      } catch (error) {
          this.server
              .to(body[0])
              .emit(
                  'error',
                  {
                      statusCode: error.statusCode,
                      message: error.message
                  },
                  body[1]
              );
            return ;
      }
  	client.emit('joinedRoom', body[0]);
  	this.server
        .to(body[0])
        .emit("userJoinChannel");
  }

  @SubscribeMessage('addToChannel')
  async onAddTochannel(client: Socket, body: {room: string, auth_id: string}) {
     try {
         const usr = await this.userService.findOneByAuthId(body.auth_id)
         if (!usr) {
             this.server
                 .to(body[0])
                 .emit(
                     'error',
                     {
                         statusCode: 404,
                         message: 'Error while adding new channel: Cant find user'
                     },
                     body.auth_id
                 )
            return ;
         }
         await this.chanService.addUserToChannel(usr, body.room)
         client.emit('joinedRoom', body.room);
         this.server
             .to(body.room)
             .emit("userJoinChannel");
     } catch (error) {
         this.server
             .to(body[0])
             .emit('error',
                 {
                     statusCode: error.statusCode,
                     message: error.message
                 },
                 body.auth_id
             );
         return ;
     }
  }

  launchCounterBan(client: Socket, auth_id: string, room: string) {
        setTimeout(async () => {
            try {
                await this.chanService.banUserToChannel(auth_id, room, false)
            } catch (error) {
                this.server
                    .to(room)
                    .emit('error',
                        {
                            statusCode: error.statusCode,
                            message: error.message
                        },
                        auth_id
                    );
                return;
            }
        }, 100000)
  }

    launchCounterMute(client: Socket, auth_id: string, room: string) {
        setTimeout(async () => {
            try {
                await this.chanService.muteUserToChannel(auth_id, room, false)
            } catch (error) {
                this.server
                    .to(room)
                    .emit(
                        'error',
                        {
                            statusCode: error.statusCode,
                            message: error.message
                        },
                        auth_id
                    );
                return ;
            }
        }, 100000)
    }

    @SubscribeMessage('banToChannel')
    async banUserToChannel(client: Socket, body: {room: string, auth_id: string, action: boolean}) {
        try {
            await this.chanService.banUserToChannel(body.auth_id, body.room, body.action)
            client.emit('banRoom');
            this.server
                .to(body.room)
                .emit("bannedChannel",
                    {
                        room: body.room,
                        auth_id: body.auth_id,
                        status: body.action
                    });
            if (body.action === true)
                this.launchCounterBan(client, body.auth_id, body.room);
        } catch (error) {
            this.server
                .to(body.room)
                .emit('error',
                    {
                        statusCode: error.statusCode,
                        message: error.message
                    },
                    body.auth_id
                );
        }
    }

    @SubscribeMessage('muteToChannel')
    async mutenUserToChannel(client: Socket, body: {room: string, auth_id: string, action: boolean}) {
        try {
            await this.chanService.muteUserToChannel(body.auth_id, body.room, body.action)
            client.emit('muteRoom');
            this.server
                .to(body.room)
                .emit("mutedChannel",
                    {
                        room: body.room,
                        auth_id: body.auth_id,
                        status: body.action
                    });
            if (body.action === true) {
                this.launchCounterMute(client, body.auth_id, body.room);
            }
        } catch (error) {
            this.server
                .to(body.room)
                .emit('error',
                    {
                        statusCode: error.statusCode,
                        message: error.message
                    },
                    body.auth_id
                );
            return ;
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
  onUpdateUser(client: Socket, user: { auth_id: number; status: number }) {
	this.server.emit('onUpdateUser', user);
  }
}
