import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy],
})
export class AuthModule {}
