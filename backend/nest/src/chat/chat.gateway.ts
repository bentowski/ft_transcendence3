import { OnModuleInit } from '@nestjs/common';
import {
 SubscribeMessage,
 WebSocketGateway,
 OnGatewayInit,
 WebSocketServer,
 OnGatewayConnection,
 OnGatewayDisconnect,
 MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
// import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';


@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080'],
  },
})
export class ChatGateway implements OnModuleInit
 //implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log("Connected");
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: body.chat,
      sender_socket_id: body.sender_socket_id,
    })
  }
//  constructor(private ChatService: ChatService) {}

 /* @WebSocketServer() server: Server;

 @SubscribeMessage('sendMessage')
 async handleSendMessage(client: Socket, payload: Chat): Promise<void> {
  //  await this.ChatService.createMessage(payload);
    console.log("msg : " + payload);
    this.server.emit('recMessage', payload);
 }

 afterInit(server: Server) {
   console.log(server);
   //Do stuffs
 }

 handleDisconnect(client: Socket) {
   console.log(`Disconnected: ${client.id}`);
   //Do stuffs
 }

 handleConnection(client: Socket, ...args: any[]) {
   console.log(`Connected ${client.id}`);
   //Do stuffs
 } */
}
