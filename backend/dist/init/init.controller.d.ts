import { InitService } from './init.service';
export declare class InitController {
    service: InitService;
    constructor(service: InitService);
    init(): Promise<{
        branch: any;
        role: any;
        account: any;
        accountRole: any;
    }>;
}
