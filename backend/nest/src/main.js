"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            credentials: true,
            origin: true,
        },
    });
    app.use(cookieParser());
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Bob l'ePONGe")
        .setDescription('The best game in the submarine world.')
        .setVersion('beta0.0.0.0.1')
        .addTag('user')
        .build();
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map