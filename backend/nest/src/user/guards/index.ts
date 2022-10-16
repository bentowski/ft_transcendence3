/*
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import UserEntity from '../entities/user-entity';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    @Inject(UserService)
    private userService: UserService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    return true;
  }
}
*/
