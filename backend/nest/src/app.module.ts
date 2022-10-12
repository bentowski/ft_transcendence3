import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
//import { User } from './user/entities/user-entity';
import { ConfigModule } from '@nestjs/config';
import { configService } from './config/config.service';
import { ChatModule } from './chat/chat.module';
import { PartiesModule } from './parties/parties.module';
import { ChanModule } from './chans/chan.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { DataSource } from 'typeorm';

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
    PassportModule.register({ session: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //constructor(private dataSource: DataSource) {}
  //getDataSource() {
  //  return this.dataSource;
  //}
}
