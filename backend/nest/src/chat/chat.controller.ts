import { Controller, Render, Get, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
// import { Chat } from './entities/chat.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

 @Get('/chat')
 @Render('index')
 Home() {
   return;
 }

 @Get('/api/chat')
 async Chat(@Res() res : any) {
   const messages = await this.chatService.getMessages();
   res.json(messages);
 }
}
