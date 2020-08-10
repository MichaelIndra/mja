"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_1 = require("@nest-modules/mailer");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const attendance_module_1 = require("./attendance/attendance.module");
const department_module_1 = require("./department/department.module");
const employee_module_1 = require("./employee/employee.module");
const report_module_1 = require("./report/report.module");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const leave_module_1 = require("./leave/leave.module");
const paySlip_module_1 = require("./paySlip/paySlip.module");
const branch_module_1 = require("./branch/branch.module");
const init_module_1 = require("./init/init.module");
const log_module_1 = require("./log/log.module");
const loan_module_1 = require("./loan/loan.module");
const mail_module_1 = require("./mailer/mail.module");
const migration = require("./migrations");
const dotenv = require("dotenv");
const core_1 = require("@nestjs/core");
const timeout_interceptor_1 = require("./timeout.interceptor");
const outcome_module_1 = require("./outcome/outcome.module");
const { parsed } = dotenv.config({
    path: process.cwd() +
        '/.env' +
        (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});
process.env = Object.assign(Object.assign({}, process.env), parsed);
const urlTransport = `${process.env.MAIL_PROTOCOL}://${process.env.MAIL_USERNAME}:${process.env.MAIL_PASSWORD}@${process.env.MAIL_HOST}${process.env.MAIL_PORT ? ':' + process.env.MAIL_PORT : ''}`;
const defaultFrom = `"${process.env.MAIL_NAME}" <${process.env.MAIL_USERNAME}@${process.env.MAIL_DOMAIN}>`;
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
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
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
            }),
            mailer_1.MailerModule.forRoot({
                transport: urlTransport,
                defaults: {
                    from: defaultFrom,
                },
                template: {
                    dir: process.cwd() + '/templates',
                    adapter: new mailer_1.HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            init_module_1.InitModule,
            auth_module_1.AuthModule,
            employee_module_1.EmployeeModule,
            attendance_module_1.AttendanceModule,
            branch_module_1.BranchModule,
            department_module_1.DepartmentModule,
            report_module_1.ReportModule,
            leave_module_1.LeaveModule,
            paySlip_module_1.PaySlipModule,
            log_module_1.LogModule,
            loan_module_1.LoanModule,
            mail_module_1.MailModule,
            outcome_module_1.OutcomeModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useValue: timeout_interceptor_1.TimeoutInterceptor,
            },
            app_service_1.AppService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map