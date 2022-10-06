import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user-entity';
import { HistoryEntity } from '../parties/entities/history-entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, HistoryEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
