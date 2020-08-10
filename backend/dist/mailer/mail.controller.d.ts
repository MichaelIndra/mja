import { MailService } from '../services/mail.service';
export declare class MailController {
    service: MailService;
    constructor(service: MailService);
    send(): Promise<any>;
}
