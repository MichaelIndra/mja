import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!exception) {
      const tmpData = {
        statusCode: status,
        name: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error..',
      };
      console.error('ERROR WITHOUT EXCEPTION', tmpData);
      response.status(500).json(tmpData);
    } else if (exception.name === 'TimeoutError') {
      console.error('ERROR TIMEOUT', request.url);
      process.exit();
    } else {
      let tmpData;
      if (exception.message.message) {
        tmpData = {
          statusCode: status,
          name: exception.name,
          timestamp: new Date().toISOString(),
          path: request.url,
          ...exception.message,
        };
      } else {
        tmpData = {
          statusCode: status,
          name: exception.name,
          message: exception.message,
          data: exception.message,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }
      console.error('ERROR FROM EXCEPTION', tmpData);
      response.status(status).json(tmpData);
    }
  }
}
