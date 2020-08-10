import { Body, Controller, Param, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto,
} from '@nestjsx/crud';
import { Account } from './account.entity';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../role/roles.guard';
import { AccountService } from './account.service';
import { Roles } from '../role/role.decorator';
import { AccountDto } from './account.dto';
import { RoleService } from '../../auth/role/role.service';

@Crud({
  model: {
    type: Account,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  query: {
    join: {
      // tslint:disable-next-line: quotemark
      account_roles: {
        exclude: [],
      },
      'account_roles.role': {
        exclude: [],
      },
      // tslint:disable-next-line: quotemark
      branch: {
        exclude: [],
      },
    },
  },
})
@ApiUseTags('Accounts')
@Controller('accounts')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class AccountController implements CrudController<Account> {
  constructor(
    public service: AccountService,
    private readonly roleService: RoleService,
  ) {}

  get base(): CrudController<Account> {
    return this;
  }

  // @Roles('admin')
  @Override()
  async getMany(@ParsedRequest() req: CrudRequest) {
    const joins = req.parsed.join;
    if (joins && !joins.find(item => item.field === 'account_roles')) {
      req.parsed.join.push({ field: 'account_roles' });
    }
    // if (joins && !joins.find(item => item.field === 'account_roles.role')) {
    //   req.parsed.join.push({ field: 'account_roles.role' });
    // }
    const listRole = [];
    const results: any = await this.base.getManyBase(req);
    let datas: any[];
    if (results.data) {
      datas = results.data;
    } else {
      datas = results;
    }
    const newResults: any = [];
    for (const item of datas) {
      const roles = [];
      for (const accountRole of item.account_roles) {
        const findRole = listRole.find(el => el.id === accountRole.role_id);
        if (findRole) {
          roles.push(findRole);
        } else {
          const findRoleFromDB = await this.roleService.findOne(
            accountRole.role_id,
          );
          if (findRoleFromDB) {
            listRole.push(findRoleFromDB);
            roles.push(findRoleFromDB);
          }
        }
      }
      const newItem = {
        ...item,
        roles,
      };
      delete newItem.account_roles;
      delete newItem.password;
      newResults.push(newItem);
    }
    return newResults;
  }

  // @Roles('admin')
  @Override('getOneBase')
  async getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    let res: any = await this.base.getOneBase(req);
    delete res.password;
    let roles = [];
    if (res.account_roles) {
      roles = res.account_roles.map(el => el.role);
    }
    res = {
      ...res,
      roles,
    };
    return res;
  }

  // @Roles('admin')
  @Override()
  createOne(@ParsedBody() dto: AccountDto) {
    return this.service.createWithRole(dto);
  }

  @Roles('admin')
  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Account>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  // @Roles('admin')
  @Override('updateOneBase')
  async coolFunction(@Param('id') id: string, @Body() dto: AccountDto) {
    let res: any = await this.service.updateWithRole(id, dto);
    delete res.password;
    const roles = res.account_roles.map(el => el.role);
    res = {
      ...res,
      roles,
    };
    return res;
  }

  @Roles('admin')
  @Override('replaceOneBase')
  async awesomePUT(@Param('id') id: string, @Body() dto: AccountDto) {
    let res: any = await this.service.updateWithRole(id, dto);
    delete res.password;
    const roles = res.account_roles.map(el => el.role);
    res = {
      ...res,
      roles,
    };
    return res;
  }

  @Roles('admin')
  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
