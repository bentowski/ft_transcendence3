import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
//import { User } from './user/entities/user-entity';
import { configService } from './config/config.service';
import { AvailableChanModule } from './available-chan/available-chan.module';
import { SearchBarModule } from './search-bar/search-bar.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
	SearchBarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
