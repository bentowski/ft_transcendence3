import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import UserEntity from '../../user/entities/user-entity';
import { AuthService } from '../auth.service';
//import { UserService } from '../user.service';
//import { Observable } from 'rxjs';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    return true;
  }
}
