import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  root(): string {
    return (
      process.env.APP_NAME +
      ' API (version: ' +
      process.env.APP_VERSION +
      '-' +
      (process.env.STAGE ? process.env.STAGE : 'development') +
      ')'
    );
  }
}
