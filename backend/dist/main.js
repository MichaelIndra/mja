"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_options_1 = require("./swagger.options");
const swagger_1 = require("@nestjs/swagger");
const fs = require("fs");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const common_1 = require("@nestjs/common");
const all_exceptions_filter_1 = require("./all-exceptions.filter");
const timeout_interceptor_1 = require("./timeout.interceptor");
const { parsed } = dotenv.config({
    path: process.cwd() + '/.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});
process.env = Object.assign(Object.assign({}, process.env), parsed);
process.on('unhandledRejection', reason => {
    console.error('UNHANDLED_REJECTION');
    console.error(reason);
    process.exit();
});
process.on('uncaughtException', reason => {
    console.error('UNCAUGHTEXCEPTION');
    console.error(reason);
    process.exit();
});
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.STAGE) {
            process.env.STAGE = 'local';
        }
        if (!process.env.CERT_KEY) {
            process.env.CERT_KEY = './cert/example.com+5-key.pem';
        }
        if (!process.env.CERT) {
            process.env.CERT = './cert/example.com+5.pem';
        }
        try {
            let app;
            if (process.env.STAGE.toLowerCase() === 'local' || process.env.USE_PROTOCOL === 'http') {
                app = yield core_1.NestFactory.create(app_module_1.AppModule);
            }
            else {
                const httpsOptions = {
                    key: fs.readFileSync(process.env.CERT_KEY),
                    cert: fs.readFileSync(process.env.CERT),
                };
                app = yield core_1.NestFactory.create(app_module_1.AppModule, { httpsOptions });
            }
            const swaggerConfig = Object.assign({}, process.env);
            const document = swagger_options_1.SwaggerBuilder(app, swaggerConfig);
            swagger_1.SwaggerModule.setup('/swagger', app, document);
            app.use(bodyParser.json({ limit: '50mb' }));
            app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
            app.useGlobalInterceptors(new timeout_interceptor_1.TimeoutInterceptor());
            app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
            app.enableCors();
            yield app.init();
            yield app.listen(process.env.APP_PORT, () => {
                console.info('== Listening on port ' + process.env.APP_PORT);
            });
        }
        catch (err) {
            common_1.Logger.error('=== SERVER PROBLEM ===', err);
            throw new Error(err);
        }
    });
}
bootstrap();
//# sourceMappingURL=main.js.map