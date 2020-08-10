import { MailerService } from '@nest-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { EFeatureList } from './feature.enum';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async send(
    to: string,
    subject: string,
    data: any,
    feature: EFeatureList,
    text: string = '',
    isHtml: boolean = false,
  ) {
    return this.mailerService
      .sendMail({
        to, // sender address
        from: `${process.env.MAIL_FROM}`, // list of receivers
        subject, // Subject line
        // text: isHtml ? '' : text, // plaintext body
        // html: isHtml ? text : '', // HTML body content
        template: 'email-' + feature + '.html', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          subject,
          ...data,
          header_url: process.env.MAIL_HEADER_IMAGE_URL,
        },
      })
      .then(res => {
        Logger.debug(res);
        // return Promise.resolve(true);
      })
      .catch(err => {
        Logger.error(err);
        // return Promise.reject(err);
      });
  }
}
