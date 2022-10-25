import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChanService } from './chan.service';
import { ChanController } from './chan.controller';
import { ChanEntity } from "./entities/chan-entity";

@Module({
    imports: [ TypeOrmModule.forFeature([ChanEntity]) ],
    providers: [ ChanService ],
    controllers: [ ChanController ],
    exports: [ TypeOrmModule, ChanService]
})
export class ChanModule {}
