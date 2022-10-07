import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthenticatedGuard, IntraAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  @Get('login')
  @UseGuards(IntraAuthGuard)
  login(@Res() res: Response) {
    //console.log(process.env.API_CALLBACK_URL);
    res.redirect('http://localhost:8080');
  }

  @Get('redirect')
  @UseGuards(IntraAuthGuard)
  redirect(@Res() res: Response): any {
    //res.send(200);
    //console.log(process.env.API_CALLBACK_URL);
    res.redirect('http://localhost:8080');
  }

  @UseGuards(AuthenticatedGuard)
  @Get('status')
  status(@Req() req: Request) {
    console.log('get status user');
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('session')
  async getAuthSession(@Session() session: Record<string, any>) {
    console.log('get session user');
    //console.log(session);
    //session.authenticated = true;
    //return session;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  logout() {
    console.log('logout user');
    return;
  }
}
