import {
	BadRequestException,
	ForbiddenException,
	HttpException,
	HttpStatus,
	Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateChanDto } from "./dto/create-chan.dto";
import ChanEntity from "./entities/chan-entity";
import * as argon2 from "argon2"
import { UserEntity } from '../user/entities/user-entity'
import {WsException} from "@nestjs/websockets";
import {UserService} from "../user/user.service";
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
		private readonly userService: UserService,
    ) {}

    async createChan(createChanDto: CreateChanDto): Promise<ChanEntity> {
		//console.log('createchandto = ', createChanDto);
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
		//console.log('new chan = ', chan);
		try {
			await this.chanRepository.save(chan);
			return chan;
		} catch (error) {
			throw new Error(error);
		}
    }

    findAll(): Promise<ChanEntity[]> {
        return this.chanRepository.find({
			relations: { banUser: true, chanUser: true, muteUser: true }
		});
    }

    async findOne(name?: string): Promise<ChanEntity> {
        const chan = await this.chanRepository.findOne({
			where: { name: name },
			relations: { banUser: true, chanUser: true, muteUser: true },
		});
        return chan;
    }

	async findOnebyID(id?: string): Promise<ChanEntity> {
        const chan = await this.chanRepository.findOne({
			where: { id: id },
			relations: { banUser: true, chanUser: true, muteUser: true }
		},);
        return chan;
    }

    async remove(id: string): Promise<void> {
        await this.chanRepository.delete(id);
    }

	async addMessage(message: Msg): Promise<ChanEntity> {
		try {
			const chan = await this.chanRepository.findOne({ where: { id: message.room }});
			if (chan) {
				if (chan.messages)
					chan.messages = [...chan.messages, message];
				else
					chan.messages = [message];
				return this.chanRepository.save(chan);
			}
			//chan.messages.push(message);
			//return chan;
		}
		catch (error) {
			console.log(error);
		}
	}

	async banUserToChannel(iduser: string, room: string, action: boolean): Promise<ChanEntity> {
		//console.log('hello les amis');
		const chan = await this.chanRepository.findOne({
				where: { id: room },
				relations: ['banUser', 'chanUser'],
			});
		if (!chan) {
			throw new BadRequestException('Error while banning user from channel: Cant find channel');
		}
		const user = await this.userService.findOneByAuthId(iduser);
		//console.log('user = ', user);
		if (!user) {
			throw new BadRequestException('Error while banning user from channel: Cant find user');
		}
		const banning = chan.banUser.find(elem => elem === user);
		//console.log('banning = ', banning);
		if (banning) {
			throw new BadRequestException('Error while banning user from channel: User already banned');
		}
		/*
		const user_ch = chan.chanUser.find(elem => elem === user);
		console.log('user ch = ', user_ch);
		if (!user_ch) {
			throw new BadRequestException('Error while banning user from channel: User not present in this channel');
		}
		 */
		//console.log('hellooooo');
		if (action === true) {
			const index: number = chan.chanUser.findIndex(obj => {
				return obj.auth_id === iduser;
			});
			if (index !== -1) {
				chan.chanUser.splice(index);
			}
			chan.banUser.push(user);
		}
		if (action === false) {
			const index: number = chan.banUser.findIndex(obj => {
				return obj.auth_id === iduser;
			});
			if (index !== -1) {
				chan.banUser.splice(index);
			}
		}

		//console.log('list of chan users = ', chan.banUser, ' list of ban users = ', chan.banUser);
		try {
			return await this.chanRepository.save(chan);
		} catch (error) {
			throw new Error(error);
		}
	}

	async muteUserToChannel(iduser: string, room: string, action: boolean): Promise<ChanEntity> {
		const chan = await this.chanRepository.findOne({
			where: { id: room },
			relations: ['muteUser','chanUser'],
		});
		if (!chan) {
			throw new BadRequestException('Error while muting user from channel: Cant find channel');
		}
		const user = await this.userService.findOneByAuthId(iduser);
		//console.log('user = ', user);
		if (!user) {
			throw new BadRequestException('Error while banning user from channel: Cant find user');
		}
		const found = chan.muteUser.find(elem => elem === user);
		if (found) {
			throw new BadRequestException('Error while muting user from channel: User already muted');
		}
		/*
		const user_ch = chan.chanUser.find(elem => elem === user);
		if (!user_ch) {
			throw new BadRequestException('Error while muting user from channel: User not present in this channel');
		}
		 */
		if (action === true) {
			chan.muteUser.push(user);
		}
		if (action === false) {
			const index: number = chan.muteUser.findIndex(obj => {
				return obj.auth_id === iduser;
			});
			if (index !== -1) {
				chan.muteUser.splice(index);
			}
		}
		try {
			return await this.chanRepository.save(chan);
		} catch (error) {
			throw new Error(error);
		}
	}

	async addUserToChannel(user: UserEntity, room: string): Promise<ChanEntity> {
		const chan = await this.chanRepository.findOne({
			where: { id: room },
			relations: ['chanUser', 'banUser'],
		});
		if (!chan) {
			throw new BadRequestException('Error while adding user to channel: Cant find channel');
		}
		if (chan.banUser.find(s => s.user_id === user.user_id)) {
			throw new ForbiddenException('Error: User is not allowed it get in this channel')
		}
		console.log('adding user to channel');
		chan.chanUser.push(user);
		try {
			return await this.chanRepository.save(chan);
		} catch (error) {
			throw new Error(error);
		}

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

	/*
	async banUnBanUser(action: boolean, idroom: string, iduser: string) {
		const chan = this.findOnebyID(idroom);
		if (!chan) {
			throw new BadRequestException('Error while banning user from chan: Cant find chan')
		}
		const user = await this.userService.findOneByAuthId(iduser);
		if (!user) {
			throw new BadRequestException('Error while banning user from channel: Cant find user');
		}
		if (action === true) {

		}
	}
	 */


	async getBanned(idroom: string) {
		const chan: ChanEntity = await this.chanRepository.findOne({
			where:{id: idroom},
			relations: ['banUser']
		});
		if (!chan)
			throw new BadRequestException('Error while fetching banned users: Cant find channel');
		return chan.banUser;
	}

	async getMuted(idroom: string) {
		const chan: ChanEntity = await this.chanRepository.findOne({
			where: {id: idroom},
			relations: ['muteUser']
		});
		if (!chan)
			throw new BadRequestException('Error while fetching muted users: Cant find channel');
		return chan.muteUser;
	}

	async getUsers(idroom: string) {
		const chan: ChanEntity = await this.chanRepository.findOne({
			where: {id: idroom},
			relations: ['chanUser','banUser','muteUser']
		});
		if (!chan)
			throw new BadRequestException('Error while fetching users: Cant find channel');
		return chan.chanUser; //.map((users) => users);
	}
}
