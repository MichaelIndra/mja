import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerBaseConfig,
  SwaggerDocument,
  SwaggerModule,
} from '@nestjs/swagger';
import _ from 'lodash';

export function SwaggerBuilder(
  app: INestApplication,
  config: any,
): SwaggerDocument {
  if (!config.STAGE) config.STAGE = 'LOCAL';
  else config.STAGE = config.STAGE.toUpperCase();

  const setSchemes: ('http' | 'https')[] =
    config.STAGE === 'LOCAL' ? ['http'] : ['https', 'http'];

  const option: SwaggerBaseConfig = new DocumentBuilder()
    .setTitle(config.APP_NAME + ' Service')
    .setDescription('API Service Documentation')
    .addBearerAuth()
    .setVersion(`v${config.APP_VERSION}-${config.STAGE.toLowerCase()}`)
    .setSchemes(...setSchemes)
    .build();

  const result = SwaggerModule.createDocument(app, option);

  // Object.values(result.paths);

  // _.map(result.paths, values => {
  //   _.map(values, value => {
  //     if (value.parameters && Array.isArray(value.parameters)) {
  //       value.parameters.push({
  //         type: 'string',
  //         name: 'realm',
  //         required: true,
  //         in: 'header',
  //       });
  //     }
  //   });
  // });

  return result;
}
