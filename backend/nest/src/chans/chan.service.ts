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
        let { name, type, password, owner, chanUser } = createChanDto;
        password = await argon2.hash(password)
        const chanInDb = await this.chanRepository.findOne({
            where: { name }
        });
        if (chanInDb) {
            throw new HttpException('Chan already exists', HttpStatus.BAD_REQUEST);
        }

        const chan: ChanEntity = await this.chanRepository.create({
            name, type, password, owner, chanUser
        })
        await this.chanRepository.save(chan);
        return chan;
    }

    findAll(): Promise<ChanEntity[]> {
        return this.chanRepository.find({relations: { chanUser: true }});
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
		const chan = await this.chanRepository.findOneBy({ id: message.room, });
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
		if (chan.chanUser && chan.chanUser.length)
			chan.chanUser = [...chan.chanUser, user];
		else
			chan.chanUser = [user];
		return await this.chanRepository.save(chan);
	}

	async delUserToChannel(user: UserEntity, room: string): Promise<ChanEntity> {
		const chan = await this.chanRepository.findOne({
			where: {id: room},
			relations: { chanUser: true },
		});
		if (!chan)
			return ;
		if (chan.chanUser && chan.chanUser.length) {
			let index = chan.chanUser.findIndex((u) => u.auth_id === user.auth_id);
			if (index >= 0) {
				chan.chanUser = chan.chanUser.filter((u) => u.auth_id !== user.auth_id);
			}
		}
		return await this.chanRepository.save(chan);
	}
}
