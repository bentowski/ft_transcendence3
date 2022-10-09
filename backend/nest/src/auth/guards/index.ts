import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IntraAuthGuard extends AuthGuard('42') {
  //async canActivate(context: ExecutionContext): Promise<any> {
  //const activate = (await super.canActivate(context)) as boolean;
  //console.log(activate);
  //const request = context.switchToHttp().getRequest();
  //console.log(request);
  //await super.logIn(request);
  //console.log('canActivate intraauth guard called ' + activate);
  //return activate;
  //}
}

/*
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    console.log('can activate authenticated guard called');
    const req = context.switchToHttp().getRequest();
    return req.isAuthenticated();
  }
}
*/
