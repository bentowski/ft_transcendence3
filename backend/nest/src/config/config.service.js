"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configService = exports.ConfigService = void 0;
require('dotenv').config();
class ConfigService {
    constructor(env) {
        this.env = env;
    }
    getValue(key, throwOnMissing = true) {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error('config error - missing env.${key}');
        }
        return value;
    }
    ensureValues(keys) {
        keys.forEach((k) => this.getValue(k, true));
        return this;
    }
    getPort() {
        return this.getValue('PORT', true);
    }
    isProduction() {
        const mode = this.getValue('MODE', false);
        return mode != 'DEV';
    }
    getTypeOrmConfig() {
        return {
            type: 'postgres',
            host: this.getValue('POSTGRES_HOST'),
            port: parseInt(this.getValue('POSTGRES_PORT')),
            username: this.getValue('POSTGRES_USER'),
            password: this.getValue('POSTGRES_PASSWORD'),
            database: this.getValue('POSTGRES_DB'),
            autoLoadEntities: true,
            synchronize: true,
        };
    }
}
exports.ConfigService = ConfigService;
const configService = new ConfigService(process.env).ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DB',
    'API_CLIENT_ID',
    'API_CLIENT_SECRET',
    'API_CALLBACK_URL',
    'SECRET_KEY',
]);
exports.configService = configService;
//# sourceMappingURL=config.service.js.map