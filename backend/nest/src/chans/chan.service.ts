import {
    HttpException,
    HttpStatus,
    Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChanDto } from "./dto/create-chan.dto";
import ChanEntity from "./entities/chan-entity";
import * as argon2 from "argon2"
// import { ChanDto } from "./dto/chan.dto";
// import { toChanDto } from "../shared/mapper";

// const argon2 = require('argon2')

@Injectable()
export class ChanService {
    constructor(
        @InjectRepository(ChanEntity)
        private readonly chanRepository: Repository<ChanEntity>,
    ) {}

    async createChan(createChanDto: CreateChanDto): Promise<ChanEntity> {
        //const chan: Chan = new Chan();
        let { name, type, password, admin, topic } = createChanDto;
        // console.log(password)
        // let save = password
        password = await argon2.hash(password)
        // let test = await argon2.verify(password, save)
        // let test2 = await argon2.verify("$argon2id$v=19$m=4096,t=3,p=1$/2pEtE21mtUAE111ksKy5Q$RGed2Dsv9Pcoknp3LAgGnnt3VmUL6BYes7c+cPfIZU0", save)
        // console.log(test)
        // console.log(test2)
        // console.log("$argon2id$v=19$m=4096,t=3,p=1$/2pEtE21mtUAE111ksKy5Q$RGed2Dsv9Pcoknp3LAgGnnt3VmUL6BYes7c+cPfIZU0")
        // console.log(password)

        //checks if the chan exists in db
        const chanInDb = await this.chanRepository.findOne({
            where: { name }
        });
        if (chanInDb) {
            throw new HttpException('Chan already exists', HttpStatus.BAD_REQUEST);
        }

        const chan: ChanEntity = await this.chanRepository.create({
            name, type, password, admin, topic,
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
