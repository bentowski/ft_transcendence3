import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import UserEntity from './entities/user-entity';
import { User42Dto } from './dto/user42.dto';
import {
  UpdateUserDto,
  UpdateAvatarDto,
  UpdateFriendsDto,
  BlockedUserDto,
} from './dto/update-user.dto';
import { UpdateUsernameDto } from './dto/update-user.dto';
import { of } from 'rxjs';
import { join } from 'path';
import { plainToClass } from 'class-transformer';
import fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser42(user42: User42Dto): Promise<UserEntity> {
    let user = await this.findOneByAuthId(user42.auth_id);
    if (!user) {
      let x = 0;
      while (await this.findOnebyUsername(user42.username)) {
        user42.username = user42.username + x.toString();
        x++;
      }
      try {
        user = await this.createUser42(user42);
        return user;
      } catch (error) {
        throw new Error(error);
      }
    }
    return user;
  }

  async currentUser(auth_id: string): Promise<UserEntity> {
    const foundUser: UserEntity = await this.findOneByAuthId(auth_id);
    if (!foundUser) {
      throw new BadRequestException(
        'Error while fetching your data: Failed requesting user in database',
      );
    }
    return foundUser;
  }

  /*
  async findOnebyID(
    user_id?: string,
    relations: string[] = [],
  ): Promise<UserEntity> {
    const findId: UserEntity = await this.userRepository.findOne({
      where: { user_id: user_id },
      relations: relations,
    });
    return findId;
  }
   */

  async findOnebyUsername(username?: string): Promise<UserEntity> {
    const findUsername: UserEntity = await this.userRepository.findOne({
      where: { username: username },
      relations: { friends: true, channelJoined: true, blocked: true },
    });
    return findUsername;
  }

  async findOneByAuthId(
    auth_id: string,
    /*relations: string[] = [], */
  ): Promise<UserEntity> {
    const findAuthId: UserEntity = await this.userRepository.findOne({
      where: { auth_id: auth_id },
      relations: { friends: true, channelJoined: true, blocked: true },
    });
    return findAuthId;
  }

  async createUser42(user42: User42Dto): Promise<UserEntity> {
    const user: UserEntity = this.userRepository.create(user42);
    user.friends = [];
    user.blocked = [];
    try {
      return this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { auth_id, username, email } = createUserDto;
    const user: UserEntity = this.userRepository.create(createUserDto);
    user.auth_id = auth_id;
    user.username = username;
    user.email = email;
    user.friends = [];
    user.blocked = [];
    user.createdAt = new Date();
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      const err: string = 'Error while saving user in database: ' + error;
      throw new NotAcceptableException(err);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const users: UserEntity[] = await this.userRepository.find();
    return users;
  }

  async updateUsername(auth_id: string, updateUsernameDto: UpdateUsernameDto) {
    const user: UserEntity = await this.findOneByAuthId(auth_id);
    if (!user) {
      throw new BadRequestException(
        'Error while updating username: Failed requesting user in database',
      );
    }
    const findUser: UserEntity = await this.findOnebyUsername(
      updateUsernameDto.username,
    );
    if (findUser) {
      throw new BadRequestException(
        'Error while updating username: Username is already taken',
      );
    } else {
      user.username = updateUsernameDto.username;
      try {
        await this.userRepository.save(user);
      } catch (error) {
        const err: string = 'Error while saving user in database: ' + error;
        throw new NotAcceptableException(err);
      }
    }
  }

  async updateAvatar(auth_id: string, updateAvatarDto: UpdateAvatarDto) {
    const user: UserEntity = await this.findOneByAuthId(auth_id);
    if (!user) {
      throw new BadRequestException(
        'Error while updating avatar: Failed requesting user in database',
      );
    }
    user.avatar = updateAvatarDto.avatar;
    try {
      await this.userRepository.save(user);
    } catch (error) {
      const err: string = 'Error while saving user in database: ' + error;
      throw new NotAcceptableException(err);
    }
  }

  async updateUser(
    authId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user: UserEntity = await this.findOneByAuthId(authId);
    if (!user) {
      throw new BadRequestException(
        'Error while updating user informations: Failed requesting user in database',
      );
    }
    const { username, avatar, twoFASecret, isTwoFA } = updateUserDto;
    /*
    if (username) {
      const fiuser: UserEntity = await this.findOnebyUsername(username)
      if (fiuser) {
        throw new BadRequestException(
          'Error while updating user informations: Username already taken',
        );
      }
      user.username = username;
    } else {
      throw new BadRequestException(
        'Error while updating user informations: Username field should not be empty',
      );
    }
    if (avatar) {
      user.avatar = avatar;
    } else {
      throw new BadRequestException(
        'Error while updating user informations: Avatar field should not be empty',
      );
    }
    if (twoFASecret) {
      user.twoFASecret = twoFASecret;
    } else {
      throw new BadRequestException(
        'Error while updating user informations: TwoFASecret field should not be empty',
      );
    }
    if (isTwoFA != user.isTwoFA) {
      user.isTwoFA = isTwoFA;
    }
     */
    user.username = username;
    user.avatar = avatar;
    user.twoFASecret = twoFASecret;
    user.isTwoFA = isTwoFA;
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      const err: string = 'Error while updating user informations: ' + error;
      throw new NotAcceptableException(err);
    }
  }

  async updateFriends(
    userId: string,
    updateFriendsDto: UpdateFriendsDto,
  ): Promise<UserEntity> {
    const user: UserEntity = await this.findOneByAuthId(userId);
    if (!user) {
      throw new BadRequestException(
        'Error while updating friends list: Failed requesting user in database',
      );
    }
    const { friends } = updateFriendsDto;
    if (friends) {
      for (let index = 0; index < friends.length; index++) {
        if (
          (await this.userRepository.findOne({
            where: {
              user_id: friends[index].user_id,
              auth_id: friends[index].auth_id,
              username: friends[index].username,
              email: friends[index].email,
            },
          })) === null
        ) {
          throw new BadRequestException(
            'Error while updating friends list: User dont exists (Stop having imaginary friends)',
          );
        }
        for (let idx = 0; idx < friends.length; idx++) {
          if (idx != index && friends[idx].auth_id === friends[index].auth_id) {
            throw new BadRequestException(
              'Error while updating friends list: Duplicated value (Friends are unique)',
            );
          }
        }
        if (friends[index].auth_id === userId) {
          throw new BadRequestException(
            'Error while updating friends list: You cant be friend with yourself (Go out and play with the other kids)',
          );
        }
      }
    }
    user.friends = friends;
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      const err: string = 'Error while updating friends list: ' + error;
      throw new NotAcceptableException(err);
    }
  }

  async getFriends(id: string): Promise<UserEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { auth_id: id },
      relations: ['friends'],
    });
    if (!user) {
      throw new BadRequestException(
        'Error while getting friends list: Failed requesting user in database',
      );
    }
    return user.friends.map((users) => users);
  }

  async getBlocked(id: string): Promise<UserEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { auth_id: id },
      relations: ['blocked'],
    });
    if (!user) {
      throw new BadRequestException(
        'Error while getting blocked users list: Failed requesting user in database',
      );
    }
    return user.blocked.map((users) => users);
  }

  async updateBlocked(
    action: boolean,
    blocked_id: string,
    current_id: string,
  ): Promise<UserEntity> {
    const curuser: UserEntity = await this.findOneByAuthId(current_id);
    if (!curuser) {
      throw new BadRequestException(
        'Error while updating blocked users: Failed requesting (un)blocking user in database',
      );
    }
    const blouser: UserEntity = await this.findOneByAuthId(blocked_id);
    if (!blouser) {
      throw new BadRequestException(
        'Error while updating blocked users: Failed requesting (un)blocked user in database',
      );
    }
    if (curuser.auth_id === blouser.auth_id) {
      throw new BadRequestException(
        'Error while updating blocked users: Users cant (un)block themselves',
      );
    }
    if (action === true) {
      curuser.blocked.push(blouser);
      const users: UserEntity[] = await this.getFriends(curuser.auth_id);
      for (let index = 0; index < users.length; index++) {
        if (users[index].auth_id === blouser.auth_id) {
          const idx = curuser.friends.indexOf(blouser);
          curuser.friends.splice(idx, 1);
        }
      }
      try {
        await this.userRepository.save(curuser);
      } catch (error) {
        const err: string = 'Error while updating blocked users: ' + error;
        throw new NotAcceptableException(err);
      }
    }
    if (action === false) {
      const index = curuser.blocked.indexOf(blouser);
      curuser.blocked.splice(index, 1);
      try {
        await this.userRepository.save(curuser);
      } catch (error) {
        const err: string = 'Error while updating unblocked users: ' + error;
        throw new NotAcceptableException(err);
      }
    }
    try {
      await this.userRepository.save(curuser);
      return curuser;
    } catch (error) {
      const err: string = 'Error while updating (un)blocked users: ' + error;
      throw new NotAcceptableException(err);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async setTwoFASecret(secret: string, user: UserEntity) {
    try {
      return this.updateUser(user.auth_id, {
        username: user.username,
        avatar: user.avatar,
        twoFASecret: secret,
        isTwoFA: user.isTwoFA,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async turnOnTwoFA(auth_id: string, user: UserEntity) {
    try {
      return this.updateUser(auth_id, {
        username: user.username,
        avatar: user.avatar,
        twoFASecret: user.twoFASecret,
        isTwoFA: 1,
      });
    } catch(error) {
      throw new Error(error);
    }
  }

  async turnOffTwoFA(auth_id: string, user: UserEntity) {
    try {
      return this.updateUser(auth_id, {
        username: user.username,
        avatar: user.avatar,
        twoFASecret: '',
        isTwoFA: 0,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  checkFolder(imagename: string) {
    const fs = require('fs');
    const files = fs.readdirSync('./uploads/profileimages/');
    if (Object.values(files).indexOf(imagename) === -1) {
      imagename = 'default.jpg';
    }
    if (Object.values(files).indexOf(imagename) === -1) {
      const error: string =
        'Error: Couldnt find ' +
        imagename +
        ' , please upload an image on your profile';
      throw new BadRequestException(error);
    }
    return imagename;
  }

  async getAvatar(id: string) {
    const user: UserEntity = await this.findOneByAuthId(id);
    if (!user) {
      throw new BadRequestException(
        'Error while getting avatar: Failed requesting user in database',
      );
    }
    if (!user.avatar) {
      user.avatar = 'default.jpg';
    }
    const imagename: any = user.avatar;
    return imagename;
  }

  async setStatus(auth_id: string, status: number) {
    const user: UserEntity = await this.findOneByAuthId(auth_id);
    if (!user) {
      throw new BadRequestException(
        'Error while setting status of user: Failed requesting user in database',
      );
    }
    if (status == 1 || status == 0) {
      user.status = status;
      try {
        await this.userRepository.save(user);
      } catch (error) {
        const err: string = 'Error while setting status of user: ' + error;
        throw new NotAcceptableException(err);
      }
    } else {
      throw new BadRequestException(
        'Error while setting status of user: Status should be 0 or 1',
      );
    }
  }
}
