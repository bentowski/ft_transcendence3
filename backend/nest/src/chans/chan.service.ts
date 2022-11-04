import {
    HttpException,
    HttpStatus,
    Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChanDto } from "./dto/create-chan.dto";
import ChanEntity from "./entities/chan-entity";
import * as argon2 from "argon2"
import { UserEntity } from '../user/entities/user-entity'
// import { ChanDto } from "./dto/chan.dto";
// import { toChanDto } from "../shared/mapper";

// const argon2 = require('argon2')

type Msg = {
	content: string;
	sender_socket_id: string;
	username: string;
	avatar: string;
	room: string;
};

@Injectable()
export class ChanService {
    constructor(
        @InjectRepository(ChanEntity)
        private readonly chanRepository: Repository<ChanEntity>,
    ) {}

    async createChan(createChanDto: CreateChanDto): Promise<ChanEntity> {
        let { name, type, password, admin, topic} = createChanDto;
        password = await argon2.hash(password)

        //checks if the chan exists in db
        const chanInDb = await this.chanRepository.findOne({
            where: { name }
        });
        if (chanInDb) {
            throw new HttpException('Chan already exists', HttpStatus.BAD_REQUEST);
        }

        const chan: ChanEntity = this.chanRepository.create({
            name, type, password, admin, topic
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

	async findOnebyID(id?: string): Promise<ChanEntity> {
        const chan = await this.chanRepository.findOneBy({id: id});
        return chan;
    }

    async remove(id: string): Promise<void> {
        await this.chanRepository.delete(id);
    }

	async addMessage(message: Msg): Promise<ChanEntity> {
		try {
		const chan = await this.chanRepository.findOneBy({ id: message.room });
		if (chan) {
			if (chan.messages)
				chan.messages = [...chan.messages, message];
			else
				chan.messages = [message];
			return this.chanRepository.save(chan);
		}
		}
		catch (error) {
			console.log(error);
		}
	}

	async addUserToChannel(user: UserEntity, room: string): Promise<ChanEntity> {
		const chan = await this.chanRepository.findOneBy({ id: room });
		if (!chan)
			return ;
    console.log(chan);
		if (chan.chanUser && chan.chanUser.length)
			chan.chanUser = [...chan.chanUser, user];
		else
			chan.chanUser = [user];
		console.log(chan);
		console.log(user);
		return await this.chanRepository.save(chan);
	}

  async banUserToChannel(user: UserEntity, room: string): Promise<ChanEntity> {
		const chan = await this.chanRepository.findOneBy({ id: room });
		if (!chan)
			return ;
    chan.chanUser.splice(chan.chanUser.indexOf(user), 1)
		if (chan.banUser && chan.banUser.length)
			chan.banUser = [...chan.banUser, user];
		else
			chan.banUser = [user];
		console.log(chan);
		console.log(user);
		return await this.chanRepository.save(chan);
	}
}
