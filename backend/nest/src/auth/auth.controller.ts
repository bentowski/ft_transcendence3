import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { /* AuthenticatedGuard, */ IntraAuthGuard } from './guards';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from '../user/interfaces/jwt-payload.interface';

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
  ) {
    console.log('successful login thru 42 api');
    const username = req.user['username'];
    const isAuth = false;
    const payload: JwtPayloadInterface = { username, isAuth };
    const access_token: string = await this.jwtService.sign(payload);
    console.log(res.cookie);
    res.cookie('jwt', access_token, { httpOnly: true });
    res.redirect('http://localhost:8080');
  }

  //@UseGuards(AuthenticatedGuard)
  @Get('status')
  status(@Req() req: Request) {
    console.log('get status user');
    return req.user;
  }

  //@UseGuards(AuthenticatedGuard)
  @Get('session')
  async getAuthSession(@Session() session: Record<string, any>) {
    console.log('get session user');
    //console.log(session);
    //session.authenticated = true;
    //return session;
  }

  //@UseGuards(AuthenticatedGuard)
  @Get('logout')
  logout() {
    console.log('logout user');
    return;
  }
}
