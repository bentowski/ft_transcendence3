import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Chat } from "./entities/chat.entity";
import { ChanService } from '../chans/chan.service';
import { ChanModule } from '../chans/chan.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ ChanModule, UserModule, TypeOrmModule.forFeature([Chat]) ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
