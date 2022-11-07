import {Controller, Render, Get, Res, UseGuards} from '@nestjs/common';
import { ChatService } from './chat.service';
import {AuthGuard} from "@nestjs/passport";
import {UserAuthGuard} from "../auth/guards/user-auth.guard";
// import { Chat } from './entities/chat.entity';

@Controller('chat')
@UseGuards(AuthGuard('jwt'), UserAuthGuard)
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
