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
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) {
      return false;
    }
    const exp = authorization.split(' ');
    if (Array.isArray(exp) && exp.length > 0) {
      // continue;
    } else {
      return false;
    }
    const user: any = jwtService.decode(exp[1]);
    if (!user) {
      return false;
    }

    const hasRole = user.roles.find(role => roles.find(el => el === role));

    return hasRole ? true : false;
  }
}
