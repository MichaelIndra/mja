import { MailerService } from '@nest-modules/mailer';
import { EFeatureList } from './feature.enum';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    send(to: string, subject: string, data: any, feature: EFeatureList, text?: string, isHtml?: boolean): Promise<void>;
}
