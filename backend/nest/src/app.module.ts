import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { configService } from './config/config.service';
import { ChatModule } from './chat/chat.module';
import { PartiesModule } from './parties/parties.module';
import { ChanModule } from './chans/chan.module';
import { AuthModule } from './auth/auth.module';
import { UserAuthGuard } from './auth/guards/user-auth.guard';
//import { PassportModule } from '@nestjs/passport';
//import { JwtModule } from '@nestjs/jwt';
//import { User } from './user/entities/user-entity';
//import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    ChatModule,
    PartiesModule,
    ChanModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserAuthGuard],
})
export class AppModule {}
