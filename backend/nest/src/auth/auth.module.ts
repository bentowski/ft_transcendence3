import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './strategies/intra.strategy';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
//import { UserService } from '../user/user.service';
//import { TypeOrmModule } from '@nestjs/typeorm';
//import UserEntity from '../user/entities/user-entity';
//import { SessionSerializer } from './utils/serializer';
//import { SessionEntity } from './entities/session-entity';
//import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
      property: 'user',
    }),
    JwtModule.register({
      secret: `${process.env.SECRET_KEY}`,
      signOptions: {
        expiresIn: `${process.env.JWT_EXPIRATION}`,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
