import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './strategies/intra.strategy';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
//import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
//import { TypeOrmModule } from '@nestjs/typeorm';
//import UserEntity from '../user/entities/user-entity';
//import { SessionSerializer } from './utils/serializer';
//import { SessionEntity } from './entities/session-entity';
//import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    /* TypeOrmModule.forFeature([UserEntity, SessionEntity ]), */
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: 10000,
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
      property: 'user',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    /* UserService, */
    IntraStrategy,
    JwtStrategy,
    /* SessionSerializer */
  ],
  exports: [/* PassportModule, */ AuthService],
})
export class AuthModule {}
