import {
    HttpException,
    HttpStatus,
    Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChanDto } from "./dto/create-chan.dto";
import ChanEntity from "./entities/chan-entity";
// import { ChanDto } from "./dto/chan.dto";
// import { toChanDto } from "../shared/mapper";

@Injectable()
export class ChanService {
    constructor(
        @InjectRepository(ChanEntity)
        private readonly chanRepository: Repository<ChanEntity>,
    ) {}

    async createChan(createChanDto: CreateChanDto): Promise<ChanEntity> {
        //const chan: Chan = new Chan();
        const { name, password, admin, topic } = createChanDto;

        //checks if the chan exists in db
        const chanInDb = await this.chanRepository.findOne({
            where: { name }
        });
        if (chanInDb) {
            throw new HttpException('Chan already exists', HttpStatus.BAD_REQUEST);
        }

        const chan: ChanEntity = await this.chanRepository.create({
            name, password, admin, topic,
        })
        await this.chanRepository.save(chan);
        return chan;
    }

    findAll(): Promise<ChanEntity[]> {
        return this.chanRepository.find();
    }

    async findOne(name?: string): Promise<ChanEntity> {
        const chan = await this.chanRepository.findOneBy({ name });
        return chan;
    }

    async remove(id: string): Promise<void> {
        await this.chanRepository.delete(id);
    }
}
