import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { IntraAuthGuard } from './guards/intra-auth.guard';
import { PayloadInterface } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import jwt from 'jwt-decode';
import UserEntity from '../user/entities/user-entity';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Get('login')
  @UseGuards(IntraAuthGuard)
  login() {
    return;
  }

  @Get('redirect')
  @UseGuards(IntraAuthGuard)
  async redirect(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<any> {
    console.log('successful login thru 42 api');
    const username: string = req.user['username'];
    const auth_id: string = req.user['auth_id'];
    const status = 0;
    const payload: PayloadInterface = { auth_id, username, status };
    console.log('username = ' + username);
    console.log('auth_id = ' + auth_id);
    const access_token: string = await this.jwtService.sign(payload);
    //console.log('verify = ' + this.jwtService.verify(access_token));
    console.log(res.cookie);
    res
      .status(202)
      .cookie('jwt', access_token, { httpOnly: false })
      .redirect('http://localhost:8080');
    //return req.user;
  }

  @Get('status')
  //@UseGuards(AuthenticatedGuard)
  status(@Req() req: Request) {
    console.log('get status user');
    return req.user;
  }

  /*
  @Get('session')
  async getAuthSession(@Session() session: Record<string, any>) {
    console.log(session.id);
    session.authenticated = true;
    return session;
  }
  */

  @Get('logout')
  logout() {
    console.log('logout user');
    return;
  }
}
