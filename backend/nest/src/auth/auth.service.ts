import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import UserEntity from '../user/entities/user-entity';
import { User42Dto } from '../user/dto/user42.dto';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { PayloadInterface } from './interfaces/payload.interface';
//import { qrcode } from 'qrcode';
//import { serialize } from 'cookie';
//import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(user42: User42Dto): Promise<UserEntity> {
    return this.userService.validateUser42(user42);
  }

  getAvatar(authId: string) {
    return this.userService.getAvatar(authId);
  }

  findUser(authId: string): Promise<UserEntity> {
    return this.userService.findOneByAuthId(authId);
  }

  async generateTwoFASecret(auth_id: string) {
    //console.log('calling generate 2fa');
    const user: UserEntity = await this.userService.findOneByAuthId(auth_id);
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.auth_id,
      process.env.TWO_FA_APP_NAME,
      secret,
    );
    await this.userService.setTwoFASecret(secret, user);
    //console.log('secret = ' + secret + ' , optauthurl = ' + otpauthUrl);
    return {
      secret,
      otpauthUrl,
    };
  }

  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  async isTwoFAValid(twoFACode: string, auth_id: string) {
    const user: UserEntity = await this.userService.findOneByAuthId(auth_id);
    console.log('twofa secret = ', user.twoFASecret);
    console.log('twofa username = ', user.username);
    return authenticator.verify({
      token: twoFACode,
      secret: user.twoFASecret,
    });
  }

  async turnOnTwoFAAuth(auth_id: string) {
    let user: UserEntity = undefined;
    user = await this.userService.findOneByAuthId(auth_id);
    console.log('found user twofa');
    return await this.userService.turnOnTwoFA(auth_id, user);
  }

  async turnOffTwoFAAuth(auth_id: string) {
    console.log('turnofftwofaauth service');
    let user: UserEntity = undefined;
    user = await this.userService.findOneByAuthId(auth_id);
    await this.userService.turnOffTwoFA(auth_id, user);
  }

  async changeStatusUser(auth_id: string, status: number) {
    try {
      await this.userService.setStatus(auth_id, status);
    } catch (error) {
      throw new Error(error);
    }
  }
}
