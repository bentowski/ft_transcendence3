import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user-entity';
import { HistoryEntity } from '../parties/entities/history-entity';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, HistoryEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SESSION_SECRET,
      signOptions: {
        expiresIn: 86400,
      },
    }),
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [JwtStrategy, PassportModule, JwtModule, TypeOrmModule, UserService],
})
export class UserModule {}
