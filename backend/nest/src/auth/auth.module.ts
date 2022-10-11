import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './strategies';
import { UserModule } from '../user/user.module';
import { SessionSerializer } from './utils/serializer';
import { SessionEntity } from './entities/session-entity';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import UserEntity from '../user/entities/user-entity';

@Module({
  imports: [
    //JwtModule.register({}),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    IntraStrategy,
    //SessionSerializer,
  ],
  //exports: [TypeORMSession],
})
export class AuthModule {}
