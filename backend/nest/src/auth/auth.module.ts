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
import UserEntity from '../user/entities/user-entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule, SessionEntity],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    {
      provide: 'USER_SERVICE',
      useClass: UserService,
    },
    IntraStrategy,
    SessionSerializer,
  ],
  //exports: [TypeORMSession],
})
export class AuthModule {}
