import {
 SubscribeMessage,
 WebSocketGateway,
 OnGatewayInit,
 WebSocketServer,
 OnGatewayConnection,
 OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';


@WebSocketGateway({cors:" http://localhost:3000", credentials: true})
export class ChatGateway
 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
 constructor(private ChatService: ChatService) {}

 @WebSocketServer() server: Server;

 @SubscribeMessage('sendMessage')
 async handleSendMessage(client: Socket, payload: Chat): Promise<void> {
   await this.ChatService.createMessage(payload);
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
 }
}
