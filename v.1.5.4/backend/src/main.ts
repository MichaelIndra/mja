import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerBuilder } from './swagger.options';
import { SwaggerModule } from '@nestjs/swagger';
import fs = require('fs');

// Load dot environment before load other modules
import dotenv = require('dotenv');
import * as bodyParser from 'body-parser';
import { Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { TimeoutInterceptor } from './timeout.interceptor';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});
process.env = { ...process.env, ...parsed };

process.on('unhandledRejection', reason => {
  console.error('UNHANDLED_REJECTION');
  console.error(reason);
  process.exit();
});

process.on('uncaughtException', reason => {
  console.error('UNCAUGHTEXCEPTION');
  console.error(reason);
  process.exit();
});

async function bootstrap() {
  if (!process.env.STAGE) {
    process.env.STAGE = 'local';
  }
  if (!process.env.CERT_KEY) {
    process.env.CERT_KEY = './cert/example.com+5-key.pem';
  }
  if (!process.env.CERT) {
    process.env.CERT = './cert/example.com+5.pem';
  }
  try {
    let app;
    if (process.env.STAGE.toLowerCase() === 'local' || process.env.USE_PROTOCOL === 'http') {
      app = await NestFactory.create(AppModule);
    } else {
      const httpsOptions = {
        key: fs.readFileSync(process.env.CERT_KEY),
        cert: fs.readFileSync(process.env.CERT),
      };
      app = await NestFactory.create(AppModule, { httpsOptions });
    }
    const swaggerConfig: any = {
      ...process.env,
    };
    const document = SwaggerBuilder(app, swaggerConfig);

    SwaggerModule.setup('/swagger', app, document);
    // the next two lines did the trick
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.useGlobalInterceptors(new TimeoutInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());

    app.enableCors();

    await app.init();
    await app.listen(process.env.APP_PORT, () => {
      console.info('== Listening on port ' + process.env.APP_PORT);
    });
  } catch (err) {
    Logger.error('=== SERVER PROBLEM ===', err);
    throw new Error(err);
  }
}

bootstrap();
