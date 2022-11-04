import { Module } from '@nestjs/common';
import { PartiesController } from './parties.controller';
import { PartiesService } from './parties.service';
import { PartiesEntity } from './entities/parties-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntity } from './entities/history-entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartiesEntity, HistoryEntity]),
    UserModule,
    PartiesModule,
  ],
  controllers: [PartiesController],
  providers: [PartiesService],
  exports: [TypeOrmModule, PartiesService],
})
export class PartiesModule {}
