import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('login')
  login() {
    return;
  }

  @Get('redirect')
  redirect(@Res() res: Response) {
    res.send(200);
  }

  @Get('status')
  status() {
    return;
  }

  @Get('logout')
  logout() {
    return;
  }
}
