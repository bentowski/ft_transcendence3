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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { IntraAuthGuard } from './guards/intra-auth.guard';
import { PayloadInterface } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TwoFACodeDto } from './dto/twofacode.dto';
//import UserEntity from "../user/entities/user-entity";
//import {JwtPayload} from "jwt-decode";
//import serialize from 'cookie';
import { AuthGuard } from '@nestjs/passport';
import UserEntity from '../user/entities/user-entity';
import jwt_decode from 'jwt-decode';

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
    const isAuth = false;
    const payload: PayloadInterface = { auth_id, username, isAuth };
    //console.log('creating token : ', payload);
    const access_token: string = this.jwtService.sign(payload);
    try {
      this.authService.changeStatusUser(auth_id, 1);
    } catch (error) {
      throw new Error(error);
    }
    res
      .status(202)
      .cookie('jwt', access_token, { httpOnly: true })
      .redirect('http://localhost:8080');
  }

  @Get('istoken')
  async authenticated(@Req() req, @Res() res): Promise<any> {
    //console.log('cookie = ', req.cookies['jwt']);
    const req_token = req.cookies['jwt'];
    if (!req_token) {
      //console.log('no cookie for the pookie 0');
      res.status(201).json({ isTok: 0 });
    } else {
      //console.log('welcome to the club mate');
      const token: PayloadInterface = jwt_decode(req_token);
      //console.log('getting token = ', token);
      const user: UserEntity = await this.authService.findUser(token.auth_id);
      if (!user) {
        //console.log('cant find user 1');
        res.status(201).json({ isTok: 1 });
      } else {
        if (user.isTwoFA) {
          //console.log('token said u need 2fa');
          if (!token.isAuth) {
            //console.log('no 2');
            res.status(201).json({ isTok: 2 });
          } else {
            //console.log('yes 3');
            res.status(200).json({ isTok: 3 });
          }
          //console.log('need 2fa please dont cheat');
        } else {
          //console.log('token said you can come in 4');
          res.status(200).json({ isTok: 4 });
        }
      }
    }
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get('status')
  status(@Req() req: Request) {
    return req.user;
  }

  //@UseGuards(AuthenticatedGuard)
  @Delete('logout')
  logout(@Req() req, @Res({ passthrough: true }) res) {
    //res.clearCookie('jwt');
    const token: any = req.cookies['jwt'];
    const decoded: any = jwt_decode(token);
    try {
      this.authService.changeStatusUser(decoded.auth_id, 0);
    } catch (error) {
      throw new Error(error);
    }
    res.status(200).cookie('jwt', '', { expires: new Date() });
  }

  @Post('2fa/generate')
  async register(@Res() response, @Req() req) {
    //console.log('calling 2fa generate');
    //console.log(request);
    const token: any = req.cookies['jwt'];
    const decoded: any = jwt_decode(token);
    const user = this.authService.findUser(decoded.auth_id);
    if (!user) {
      throw new HttpException('cant find user', HttpStatus.NOT_FOUND);
    }
    const { otpauthUrl } = await this.authService.generateTwoFASecret(
      decoded.auth_id,
    );
    return this.authService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('2fa/activate')
  async turnOnTwoFAAuth(
    @Req() req,
    @Body() obj: TwoFACodeDto,
    @Res({ passthrough: true }) res,
  ) {
    console.log('code = ', obj.twoFACode);
    const token: any = req.cookies['jwt'];
    const decoded: PayloadInterface = jwt_decode(token);
    //twoFACode = JSON.stringify(twoFACode);
    console.log('auth_id - ', decoded.auth_id);
    const isValid = await this.authService.isTwoFAValid(
      obj.twoFACode,
      decoded.auth_id,
    );
    console.log('is valid - ', isValid);
    if (!isValid) {
      throw new UnauthorizedException('wrong 2fa code');
    }
    console.log('validation ok');
    const username: string = decoded.username; //['username'];
    const auth_id: string = decoded.auth_id; //user['auth_id'];
    const isAuth = true;
    const payload: PayloadInterface = { auth_id, username, isAuth };
    const access_token: string = this.jwtService.sign(payload);
    //const access_token = await this.authService.getJwtToken(request.auth_id, 1);
    console.log('access token : ', access_token);
    await this.authService.turnOnTwoFAAuth(req.auth_id);
    res.status(200).cookie('jwt', access_token, { httpOnly: true });
  }

  @Post('2fa/deactivate')
  async turnOffTwoFAAuth(
    @Req() request: PayloadInterface,
    @Res({ passthrough: true }) res,
  ) {
    //console.log('deactivate auth controller');
    await this.authService.turnOffTwoFAAuth(request.auth_id);
    res.status(200);
  }

  @Post('2fa/authenticate')
  async authenticate(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body() obj: TwoFACodeDto,
  ) {
    //console.log('REQUEST = ', req);
    const token: any = req.cookies['jwt'];
    const decoded: PayloadInterface = jwt_decode(token);
    //console.log('decoded = ', decoded);
    //console.log('twofacode = ', obj.twoFACode);
    const isValid = await this.authService.isTwoFAValid(
      obj.twoFACode,
      decoded.auth_id,
    );
    //console.log('isvalid = ', isValid);
    if (!isValid) {
      throw new UnauthorizedException('wrong 2fa code');
      //res.status(200).json({ message: 'mové code ' });
    }
    //console.log('oksapass');
    const username: string = decoded.username; //['username'];
    const auth_id: string = decoded.auth_id; //user['auth_id'];
    const isAuth = true;
    const payload: PayloadInterface = { auth_id, username, isAuth };
    //console.log('payload = ', payload);
    const access_token = this.jwtService.sign(payload);
    //console.log('signing access token = ', access_token);
    //const access_token = await this.authService.getJwtToken(request.auth_id, 1);
    res.status(200).cookie('jwt', access_token, { httpOnly: true });
    //console.log('cookie sent');
  }
}
