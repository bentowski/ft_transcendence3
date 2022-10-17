import {
  /* Body, */
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { IntraAuthGuard } from './guards/intra-auth.guard';
import { PayloadInterface } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
//import { TwoFACodeDto } from './dto/twofacode.dto';

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
    const username: string = req.user['username'];
    const auth_id: string = req.user['auth_id'];
    const payload: PayloadInterface = { auth_id, username };
    const access_token: string = await this.jwtService.sign(payload);
    res
      .status(202)
      .cookie('jwt', access_token, { httpOnly: true })
      .redirect('http://localhost:8080');
  }

  @Get('status')
  status(@Req() req: Request) {
    return req.user;
  }

  //KEEP FOLLOWING COMMENTED CODE
  /*
  @Get('session')
  async getAuthSession(@Session() session: Record<string, any>) {
    console.log('get session user');
    //console.log(session);
    //session.authenticated = true;
    //return session;
  }
  */

  //KEEP FOLLOWING COMMENTED CODE
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
