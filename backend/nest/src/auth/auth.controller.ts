import {
  /* Body, */
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { IntraAuthGuard } from './guards/intra-auth.guard';
import { PayloadInterface } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TwoFACodeDto } from './dto/twofacode.dto';
import jwt_decode from 'jwt-decode';
//import UserEntity from "../user/entities/user-entity";
//import {JwtPayload} from "jwt-decode";
import serialize from 'cookie';

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
    const isAuth = 0;
    const payload: PayloadInterface = { auth_id, username, isAuth };
    const access_token: string = await this.jwtService.sign(payload);
    res
      .status(202)
      .cookie('jwt', access_token, { httpOnly: true })
      .redirect('http://localhost:8080');
  }

  @Get('islogin')
  async authenticated(@Req() req, @Res() res): Promise<any> {
    const req_token = req.cookies['jwt'];
    //console.log('requested token = ', req_token);
    let auth = false;
    if (!req_token) {
      //console.log('blablalba');
      return res.status(200).json({ isAuth: false });
    }
    try {
      //console.log('coucocucoucocucocuc');
      if (!this.jwtService.verify(req_token)) {
        throw 'token not valid';
      } else {
        auth = true;
      }
    } catch (err) {
      console.log('invalid token');
    }
    if (!auth) {
      return res.status(400).json({ isAuth: false });
    } else {
      const data = this.jwtService.verify(req_token);
      const user = await this.authService.findUser(data.auth_id);
      if (!user) {
        return res.status(400).json({
          isAuth: false,
        });
      }
      return res.status(200).json({ isAuth: true });
    }
    //const token = req.cookies['jwt'];
    //return !!token;
    //const decoded = jwt_decode(req.cookies['jwt']);
    //console.log(decoded);
    //const auth_id = decoded;
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

  //@UseGuards(AuthenticatedGuard)
  @Delete('logout')
  logout(@Req() req, @Res({ passthrough: true }) res) {
    //const { cookies } = req;
    /*
    const jwt = req?.cookies['jwt'];
    console.log('welcome in logout = ', jwt);
    if (!jwt) {
      return res.status(401).json({
        status: 'error',
        error: 'unauthorized',
      });
    }
    /*
    const payload: any = jwt_decode(jwt);
    console.log(payload);
    const newCookie = {
      auth_id: payload.auth_id,
      username: payload.username,
      isAuth: payload.isAuth,
      iat: payload.iat,
      exp: -1,
    };
    const access_token: string = await this.jwtService.sign(newCookie);
    res.status(202).cookie('jwt', access_token, { httpOnly: true });
    */
    /*
    const serialized = serialize('jwt', null, {
      maxAge: -1,
      path: '/',
    });
    res.setHeader('Set-Cookie', serialized);
    res.status(200).json({
      status: 'success',
      message: 'Logged out',
    }).
    */
    res.clearCookie('jwt');
    /*
      .send(200)
      .json({ message: 'user logged out' })
      .redirect('http://localhost:8080/login');

       */
    return 'logged out succesfully';
  }
  /*
  @Post('logout')
  async logout(@Req() request: PayloadInterface, @Res() response: Response) {
    response.cookie('jwt', this.authService.getCookieLogout());
    return response.sendStatus(200);
  }
  
  */

  @Post('2fa/generate')
  async register(@Res() response, @Req() request: PayloadInterface) {
    //console.log('calling 2fa generate');
    //console.log(request);
    const { otpauthUrl } = await this.authService.generateTwoFASecret(
      request.auth_id,
    );
    return this.authService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('2fa/activate')
  async turnOnTwoFAAuth(
    @Req() request: PayloadInterface,
    @Body() { twoFACode }: TwoFACodeDto,
  ) {
    //console.log('code = ' + twoFACode);
    const isValid = this.authService.isTwoFAValid(twoFACode, request.auth_id);
    if (!isValid) {
      throw new UnauthorizedException('wrong 2fa code');
    }
    //console.log('validation ok');
    await this.authService.turnOnTwoFAAuth(request.auth_id);
  }

  @Post('2fa/deactivate')
  async turnOffTwoFAAuth(@Req() request: PayloadInterface, @Res() response) {
    console.log('deactivate auth controller');
    return this.authService.turnOffTwoFAAuth(request.auth_id);
  }

  @Post('2fa/authenticate')
  async authenticate(
    @Req() request: PayloadInterface,
    @Res({ passthrough: true }) response: Response,
    @Body() { twoFACode }: TwoFACodeDto,
  ) {
    const isValid = this.authService.isTwoFAValid(twoFACode, request.auth_id);
    if (!isValid) {
      throw new UnauthorizedException('wrong 2fa code');
    }
    const access_token = await this.authService.getJwtToken(request.auth_id, 1);
    response.cookie('jwt', access_token, { httpOnly: true });
    let user = undefined;
    user = await this.authService.findUser(request.auth_id);
    return user;
  }
}
