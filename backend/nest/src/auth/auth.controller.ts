import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { IntraAuthGuard } from './guards/intra-auth.guard';
import { PayloadInterface } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import jwt from 'jwt-decode';
import { TwoFACodeDto } from './dto/twofacode.dto';
//import UserEntity from '../user/entities/user-entity';
//import { serialize } from "cookie";
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

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
    //const avatar: string = req.user['avatar'];
    //const status = 0;
    const payload: PayloadInterface = { auth_id, username };
    //console.log('username = ' + username);
    //console.log('auth_id = ' + auth_id);
    //const secretOrKey = process.env.SECRET_KEY;
    const access_token: string = await this.jwtService.sign(payload);
    //console.log('verify = ' + this.jwtService.verify(access_token));
    console.log(access_token);
    res
      .status(202)
      .cookie('jwt', access_token, { httpOnly: true })
      .redirect('http://localhost:8080');
    //return req.user;
  }

  //@UseGuards(AuthenticatedGuard)
  @Get('status')
  //@UseGuards(AuthenticatedGuard)
  status(@Req() req: Request) {
    console.log('get status user');
    return req.user;
  }

  /*
  @Get('session')
  async getAuthSession(@Session() session: Record<string, any>) {
    console.log('get session user');
    //console.log(session);
    //session.authenticated = true;
    //return session;
  }
  */

  /*
  //@UseGuards(AuthenticatedGuard)
  @Get('logout')
  logout(@Req() req, @Res() res) {
    //const { cookies } = req;
    const jwt = req?.cookies['jwt'];
    console.log(jwt);
    if (!jwt) {
      return res.status(401).json({
        status: 'error',
        error: 'unauthorized',
      });
    }
    const serialized = serialize('jwt', null, {
      maxAge: -1,
      path: '/',
    });
    res.setHeader('Set-Cookie', serialized);
    res.status(200).json({
      status: 'success',
      message: 'Logged out',
    });
  }
  */

  @Post('logout')
  async logout(@Req() request: PayloadInterface, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieLogout());
    return response.sendStatus(200);
  }

  @Post('2fa/generate')
  async register(@Res() response, @Req() request: PayloadInterface) {
    const { otpauthUrl } = await this.authService.generateTwoFASecret(
      request.auth_id,
    );
    return this.authService.pipeQrCodeStream(response, otpauthUrl);
  }

  //@Post('2fa/activate')
  //async turnOnTwoFAAuth(@Req() request: PayloadInterface, @Body() { twoFACode } : TwoFACodeDto)
}
