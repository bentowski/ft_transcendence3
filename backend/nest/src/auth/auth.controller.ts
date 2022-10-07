import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthenticatedGuard, IntraAuthGuard } from './guards';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Get('login')
  @UseGuards(IntraAuthGuard)
  login(@Res() res: Response) {
    res.redirect(this.configService.get('oauth.redirect'));
  }

  @Get('redirect')
  @UseGuards(IntraAuthGuard)
  redirect(@Res() res: Response) {
    //res.send(200);
    res.redirect(this.configService.get('oauth.redirect'));
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status(@Req() req: Request) {
    return req.user;
  }

  @Get('session')
  async getAuthSession(@Session() session: Record<string, any>) {
    console.log(session.id);
    console.log(session.token);
    session.authenticated = true;
    return session;
  }

  @Get('logout')
  logout() {
    return;
  }
}
