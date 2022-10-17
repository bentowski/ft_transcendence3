import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import UserEntity from '../user/entities/user-entity';
import { User42Dto } from '../user/dto/user42.dto';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { qrcode } from 'qrcode';
import { serialize } from 'cookie';
//import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(user42: User42Dto): Promise<UserEntity> {
    console.log('validate user auth service called');
    return this.userService.validateUser42(user42);
  }

  /*
  createUser(user42: User42Dto): Promise<UserEntity> {
    return this.userService.createUser42(user42);
  }
  */

  getAvatar(authId: string) {
    return this.userService.getAvatar(authId);
  }

  findUser(authId: string): Promise<UserEntity> {
    console.log('finduser auth service called');
    return this.userService.findOneByAuthId(authId);
  }

  async generateTwoFASecret(auth_id: string) {
    const user: UserEntity = await this.userService.findOneByAuthId(auth_id);
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.auth_id,
      process.env.TWO_FA_APP_NAME,
      secret,
    );
    await this.userService.setTwoFASecret(secret, user);
    return {
      secret,
      otpauthUrl,
    };
  }

  getCookieLogout() {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
  }

  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  isTwoFAValid(twoFACode: string, user: UserEntity) {
    return authenticator.verify({
      token: twoFACode,
      secret: user.twoFASecret,
    })
  }
  /*

  logout(req, res) {

  }

   */
}
