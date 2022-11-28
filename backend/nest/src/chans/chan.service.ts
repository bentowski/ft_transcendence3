import {
	BadRequestException,
	NotFoundException,
	Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {CreateChanDto, CreatePrivChanDto} from "./dto/create-chan.dto";
import ChanEntity from "./entities/chan-entity";
import * as argon2 from "argon2"
import { UserEntity } from '../user/entities/user-entity'
import { UserService} from "../user/user.service";
import * as io from "socket.io-client";

const socket = io.connect("http://localhost:3000/chat");

type Msg = {
	content: string;
	sender_socket_id: string;
	username: string;
	avatar: string;
	auth_id: string;
	room: string;
};

@Injectable()
export class ChanService {
    constructor(
        @InjectRepository(ChanEntity)
        private readonly chanRepository: Repository<ChanEntity>,
		private readonly userService: UserService,
    ) {}

	async createPrivChan(createPrivChanDto: CreatePrivChanDto): Promise<ChanEntity> {
		const { type, name, user_1_id, user_2_id } = createPrivChanDto;
		if (name.length < 3 || name.length > 10) {
			throw new BadRequestException('Error while creating new chan: Chan name length should be between 3 and 10 characters')
		}
		if (!name.match(/^[\w-]+$/)) {
			throw new BadRequestException('Error while creating new Chan: Name should be alphanum')
		}
		const chanInDb = await this.chanRepository.findOne({
			where: { name: name },
		});
		if (chanInDb) {
			throw new BadRequestException('Error while creating new Chan: Chan already exists');
		}
		const user1: UserEntity = await this.userService.findOneByAuthId(user_1_id);
		if (!user1) {
			throw new NotFoundException('Error while creating new Chan: Cant find user');
		}
		const user2: UserEntity = await this.userService.findOneByAuthId(user_2_id);
		if (!user2) {
			throw new NotFoundException('Error while creating new Chan: Cant find user');
		}
		const chan: ChanEntity = this.chanRepository.create({
			type: type,
			name: name,
			owner: user1.username,
			password: '',
			messages: [],
			chanUser: [],
			banUser: [],
			muteUser: [],
		})
		chan.chanUser.push(user1);
		chan.chanUser.push(user2);
		try {
			await this.chanRepository.save(chan);
			return chan;
		} catch (error) {
			throw new Error(error);
		}
	}

    async createChan(createChanDto: CreateChanDto): Promise<ChanEntity> {
        const { name, type, password, owner /*, chanUser */ } = createChanDto;
		if (name.length < 3 || name.length > 10) {
			throw new BadRequestException('Error while creating new chan: Chan name length should be between 3 and 10 characters')
		}
		if (!name.match(/^[\w-]+$/)) {
			throw new BadRequestException('Error while creating new chan: Name should be alphanum')
		}
		let hashed = undefined;
		if ((type === 'public' || type === 'private') && (password !== null && password !== '')) {
			throw new BadRequestException('Error while creating new Chan: Public or Private chans cant have a password');
		}
		if (password && type === 'protected') {
			if (password.length < 8 || password.length > 30) {
				throw new BadRequestException('Error while creating new chan: Password should be between 8 and 30 characters')
			}
			hashed = await argon2.hash(password)
		} else {
			hashed = null;
		}
        const chanInDb = await this.chanRepository.findOne({
            where: { name: name },
        });
        if (chanInDb) {
            throw new BadRequestException('Error while creating new Chan: Chan already exists');
        }
		const user: UserEntity = await this.userService.findOnebyUsername(owner);
		if (!user) {
			throw new NotFoundException('Error while creating new Chan: Cant find user');
		}
        const chan: ChanEntity = this.chanRepository.create({
            type: type,
			name: name,
			owner: owner,
			password: hashed,
			messages: [],
			chanUser: [],
			banUser: [],
			muteUser: [],
        })
		chan.chanUser.push(user);
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

	async addMessage(msg: Msg) {
		try {
			const chan = await this.chanRepository.findOne({ where: { id: msg.room }});
			if (!chan) {
				const error = {
					statusCode: 404,
					message: 'Error while adding new message: Can find channel',
				}
				return error;
			}
			chan.messages.push(msg);
			await this.chanRepository.save(chan);
			return chan;
		}
		catch (error) {
			throw new Error(error);
		}
	}

	async banUserToChannel(iduser: string, room: string, action: boolean): Promise<ChanEntity> {
		const chan = await this.chanRepository.findOne({
				where: { id: room },
				relations: ['banUser', 'chanUser'],
			});
		if (!chan) {
			throw new NotFoundException('Error while banning user from channel: Cant find channel');
		}
		const user = await this.userService.findOneByAuthId(iduser);
		if (!user) {
			throw new BadRequestException('Error while banning user from channel: Cant find user');
		}
		const banning = chan.banUser.find(elem => elem === user);
		if (banning) {
			const error = {
				statusCode: 450,
				message: 'Error while banning user from channel: User already banned',
			}
			throw error;
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
			throw new NotFoundException('Error while muting user from channel: Cant find channel');
		}
		const user = await this.userService.findOneByAuthId(iduser);
		//console.log('user = ', user);
		if (!user) {
			throw new BadRequestException('Error while banning user from channel: Cant find user');
		}
		const found = chan.muteUser.find(elem => elem === user);
		if (found) {
			const error = {
				statusCode: 451,
				message: 'Error while muting user from channel: User already muted',
			}
			throw error;
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
			throw new NotFoundException('Error while adding user to a channel: Cant find channel');
		}
		console.log('//// chan found')
		if (chan.banUser.find(s => s.user_id === user.user_id)) {
			const error = {
				statusCode: 450,
				message: 'Error: User is not allowed to get in this channel',
			}
			throw error;
		}
		console.log('/////p ushing user to channel');
		chan.chanUser.push(user);
		try {
			return await this.chanRepository.save(chan);
		} catch (error) {
			throw new Error(error);
		}

	}

	async delUserToChannel(user: UserEntity, room: string): Promise<ChanEntity> {
		const chan = await this.chanRepository.findOne({
			where: { id: room },
			relations: ['chanUser', 'banUser'],
		});
		if (!chan) {
			throw new NotFoundException('Error while removing user to a channel: Cant find channel');
		}
		// console.log("avant : ", chan.chanUser)
		if (chan.owner === user.username) {
			try {
				await this.chanRepository.delete(chan.id);
				//! socket emit reload for room's user
				socket.emit("updateChan", room);
				return ;
			} catch (error) {
				throw new Error(error);
			}
		}
		chan.chanUser.splice(chan.chanUser.findIndex((u) => u === user))
		// console.log("apres : ", chan.chanUser)
		// chan.chanUser.push(user);
		try {
			return await this.chanRepository.save(chan);
		} catch (error) {
			throw new Error(error);
		}

	}

	/* async delUserToChannel(user: UserEntity, room: string): Promise<ChanEntity> {
		const chan = await this.chanRepository.findOne({
			where: {id: room},
			relations: { chanUser: true },
		});
		if (!chan)
			return ;
		if (chan.chanUser && chan.chanUser.length) {
			const index = chan.chanUser.findIndex((u) => u.auth_id === user.auth_id);
			if (index >= 0) {
				chan.chanUser = chan.chanUser.filter((u) => u.auth_id !== user.auth_id);
			}
		}
		try {
			return await this.chanRepository.save(chan);
		} catch (error) {
			throw new Error();
		}

	} */

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
			throw new NotFoundException('Error while fetching banned users: Cant find channel');
		return chan.banUser;
	}

	async getMuted(idroom: string) {
		const chan: ChanEntity = await this.chanRepository.findOne({
			where: {id: idroom},
			relations: ['muteUser']
		});
		if (!chan)
			throw new NotFoundException('Error while fetching muted users: Cant find channel');
		return chan.muteUser;
	}

	async getUsers(idroom: string) {
		const chan: ChanEntity = await this.chanRepository.findOne({
			where: {id: idroom},
			relations: ['chanUser']
		});
		if (!chan) {
			throw new NotFoundException('Error while fetching users: Cant find channel');
		}
		//console.log('list of users in chan = ', chan.chanUser);
		return chan.chanUser; //.map((users) => users);
	}

	async verifyPass(cid: string, pass: string, uid: string) {
		const user: UserEntity = await this.userService.findOneByAuthId(uid);
		if (!user) {
			throw new NotFoundException('Error while verifying channel password: User not found');
		}
		console.log('find user ', user)
		const chan: ChanEntity = await this.chanRepository.findOne({
			where: { id: cid }
		})
		if (!chan) {
			throw new NotFoundException('Error while verifying channel password: Chan not found')
		}
		console.log('here is pass ', pass)
		if (!pass || pass === '') {
			throw new BadRequestException('Error while verifying channel password: Chan password is empty')
		}
		console.log('password is not empty ', pass)
		if (await argon2.verify(chan.password, pass)) {
			console.log('password is ok')
			try {
				await this.addUserToChannel(user, cid);
			} catch (error) {
				throw new Error(error);
			}
			return true;
		} else {
			return false;
		}

	}
}
