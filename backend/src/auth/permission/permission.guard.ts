import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

// Load dot environment before load other modules
import dotenv = require('dotenv');
const { parsed } = dotenv.config({
  path: process.cwd() + '/.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});
process.env = { ...process.env, ...parsed };

const jwtService = new JwtService({
  secret: process.env.JWT_SECRET,
});
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) {
      return false;
    }
    const user: any = jwtService.decode(request.authorization);

    const hasPermission = () =>
      user.permissions.find(permission => permissions.includes(permission));

    return hasPermission ? true : false;
  }
}
