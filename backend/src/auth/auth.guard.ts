import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

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
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) {
      return false;
    }
    const exp = authorization.split(' ');
    const token = exp[1];
    const verify = jwtService.verify(token);
    if (verify) return true;
    else false;
  }
}
