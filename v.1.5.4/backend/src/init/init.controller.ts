import { Controller, Post } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { InitService } from './init.service';

@ApiUseTags('Init')
@Controller('init')
export class InitController {
  constructor(public service: InitService) {}

  @Post()
  async init() {
    const branch = await this.service.createBranch();
    const role = await this.service.createRole();
    const account = await this.service.createAccount();
    const accountRole = await this.service.createAccountRole();
    return {
      branch,
      role,
      account,
      accountRole,
    };
  }
}
