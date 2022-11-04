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
import { UserAuthGuard } from './guards/user-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

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
    const auth_id: string = req.user['auth_id'];
    const isAuth = false;
    const payload: PayloadInterface = { auth_id, isAuth };
    const access_token: string = this.jwtService.sign(payload);
    try {
      this.authService.changeStatusUser(auth_id, 1);
      res
        .status(202)
        .cookie('jwt', access_token, { sameSite: 'none', httpOnly: true })
        .redirect('http://localhost:8080');
    } catch (error) {
      throw new Error(error);
    }
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get('istoken')
  async authenticated(@Req() req, @Res() res): Promise<any> {
    const req_token = req.cookies['jwt'];
    if (!req_token) {
      res.status(201).json({ isTok: 0 });
    } else {
      const token: PayloadInterface = jwt_decode(req_token);
      const user: UserEntity = await this.authService.findUser(token.auth_id);
      if (!user) {
        res.status(201).json({ isTok: 1 });
      } else {
        if (user.isTwoFA) {
          if (!token.isAuth) {
            res.status(201).json({ isTok: 2 });
          } else {
            res.status(200).json({ isTok: 3 });
          }
        } else {
          res.status(200).json({ isTok: 4 });
        }
      }
    }
  }

  //@UseGuards(AuthenticatedGuard)
  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Delete('logout')
  logout(@Req() req, @Res({ passthrough: true }) res) {
    try {
      this.authService.changeStatusUser(req.user.auth_id, 0);
      res.status(200).cookie('jwt', '', { expires: new Date() });
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Post('2fa/generate')
  async register(@Res() response, @Req() req) {
    const auid: string = req.user.auth_id;
    const user = this.authService.findUser(auid);
    if (!user) {
      throw new HttpException('cant find user', HttpStatus.NOT_FOUND);
    }
    const { otpauthUrl } = await this.authService.generateTwoFASecret(auid);
    return this.authService.pipeQrCodeStream(response, otpauthUrl);
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Post('2fa/activate')
  async turnOnTwoFAAuth(
    @Req() req,
    @Body() obj: TwoFACodeDto,
    @Res({ passthrough: true }) res,
  ) {
    const auid: string = req.user.auth_id;
    const isValid = await this.authService.isTwoFAValid(obj.twoFACode, auid);
    if (!isValid) {
      throw new UnauthorizedException('wrong 2fa code');
    }
    const auth_id: string = req.user.auth_id; //user['auth_id'];
    const isAuth = true;
    const payload: PayloadInterface = { auth_id, isAuth };
    const access_token: string = this.jwtService.sign(payload);
    try {
      await this.authService.turnOnTwoFAAuth(auid);
      res.status(200).cookie('jwt', access_token, { httpOnly: true });
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Post('2fa/deactivate')
  async turnOffTwoFAAuth(@Req() req, @Res({ passthrough: true }) res) {
    try {
      await this.authService.turnOffTwoFAAuth(req.user.auth_id);
      res.status(200);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), IntraAuthGuard)
  @Post('2fa/authenticate')
  async authenticate(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body() obj: TwoFACodeDto,
  ) {
    const auid: string = req.user.auth_id;
    const isValid = await this.authService.isTwoFAValid(obj.twoFACode, auid);
    if (!isValid) {
      throw new UnauthorizedException('wrong 2fa code');
    }
    const auth_id: string = req.user.auth_id; //user['auth_id'];
    const isAuth = true;
    const payload: PayloadInterface = { auth_id, isAuth };
    const access_token = this.jwtService.sign(payload);
    res.status(200).cookie('jwt', access_token, { httpOnly: true });
  }
}
