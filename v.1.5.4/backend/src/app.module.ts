import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { DepartmentModule } from './department/department.module';
import { EmployeeModule } from './employee/employee.module';
import { ReportModule } from './report/report.module';
import { ScheduleModule } from './schedule/schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { LeaveModule } from './leave/leave.module';
import { RewardDeductionModule } from './rewardDeduction/rewardDeduction.module';
import { PaySlipModule } from './paySlip/paySlip.module';
import { RuleModule } from './rule/rule.module';
import { BranchModule } from './branch/branch.module';
import { InitModule } from './init/init.module';
import { LogModule } from './log/log.module';
import { LoanModule } from './loan/loan.module';
import { MailModule } from './mailer/mail.module';
import * as migration from './migrations';

// Load dot environment before load other modules
import dotenv = require('dotenv');
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from './timeout.interceptor';
import { OutcomeModule } from './outcome/outcome.module';

const { parsed } = dotenv.config({
  path:
    process.cwd() +
    '/.env' +
    (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});
process.env = { ...process.env, ...parsed };

// mailer
const urlTransport = `${process.env.MAIL_PROTOCOL}://${
  process.env.MAIL_USERNAME
}:${process.env.MAIL_PASSWORD}@${process.env.MAIL_HOST}${
  process.env.MAIL_PORT ? ':' + process.env.MAIL_PORT : ''
}`;
const defaultFrom = `"${process.env.MAIL_NAME}" <${process.env.MAIL_USERNAME}@${process.env.MAIL_DOMAIN}>`;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      password: process.env.TYPEORM_PASSWORD,
      username: process.env.TYPEORM_USERNAME,
      database: process.env.TYPEORM_DATABASE,
      port: Number(process.env.TYPEORM_PORT),
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
        __dirname + '/**/**/*.entity{.ts,.js}',
        __dirname + '/**/**/**/*.entity{.ts,.js}',
      ],
      logging: Boolean(process.env.TYPEORM_LOGGING),
      synchronize: false,
      migrationsRun: true,
      dropSchema: false,
      cli: {
        migrationsDir: __dirname + '/migrations',
      },
      migrations: [
        migration.InitDB1571220308741,
        migration.AddColumnBpjsNpwpAreaToEmployee1571221215220,
        migration.AddColumnMetaAndDepartmentIdToAttendance1571221713660,
        migration.RemoveDepartmentFromAttendance1571285255074,
        migration.InitBranch1571641196163,
        migration.AddColumnPictureDateOfBirthPhoneNoToEmployee1571708805389,
        migration.ChangeAttendaceMetaColumnType1571818221977,
        migration.AddColumnMetaToEmployeeAndDepartment1572430833560,
        migration.ChangeUniqueDepartmentAndBranchName1572559196742,
        migration.DeleteColumnDateEntryFromEmployee1572852968259,
        migration.ChangePayslipTable1573162055369,
        migration.EmployeeStatus1575340094197,
        migration.ChangeLogColumn1575344935985,
        migration.AddColumnSwitchableToGroup1576655997195,
        migration.Loan1576658432966,
        migration.AddColumnTokenResetPassword1576229740937,
        migration.ChangeLoanScheme1578884646528,
        migration.AddColumnDescriptionToLoan1578902706234,
        migration.addRelationDepartmentOutcome1581081235886,
        migration.DefineUniqueMultipleColumnInPayslips1581590022548,
      ],
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    MailerModule.forRoot({
      transport: urlTransport,
      defaults: {
        from: defaultFrom,
      },
      template: {
        dir: process.cwd() + '/templates',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
    InitModule,
    AuthModule,
    EmployeeModule,
    AttendanceModule,
    BranchModule,
    DepartmentModule,
    ReportModule,
    // ScheduleModule,
    LeaveModule,
    // RewardDeductionModule,
    PaySlipModule,
    // RuleModule,
    LogModule,
    LoanModule,
    MailModule,
    OutcomeModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: TimeoutInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
