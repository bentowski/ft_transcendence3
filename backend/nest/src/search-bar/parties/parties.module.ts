import { Module } from '@nestjs/common';
import { PartiesController } from './parties.controller';
import { PartiesService } from './parties.service';
import { PartiesEntity } from './entities/parties-entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PartiesEntity])],
  controllers: [PartiesController],
  providers: [PartiesService],
  exports: [ TypeOrmModule ]
})
export class PartiesModule {}
