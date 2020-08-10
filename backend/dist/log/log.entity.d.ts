import { BaseEntity } from '../base.entity';
import { Account } from '../auth/account/account.entity';
import { MetaLog } from './log.meta';
export declare class Log extends BaseEntity {
    entity: string;
    action: string;
    account_id: string;
    account: Account;
    meta: MetaLog;
    protected beforeInsert(): void;
}
