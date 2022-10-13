"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntraStrategy = void 0;
const passport_42_1 = require("passport-42");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
let IntraStrategy = class IntraStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    constructor(authService) {
        super({
            clientID: process.env.API_CLIENT_ID,
            clientSecret: process.env.API_CLIENT_SECRET,
            callbackURL: process.env.API_CALLBACK_URL,
            scope: ['public'],
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile) {
        const { id, username } = profile;
        const user = {
            auth_id: id,
            username: username,
            email: profile['emails'][0]['value'],
        };
        const newUser = await this.authService.validateUser(user);
        return newUser;
    }
};
IntraStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], IntraStrategy);
exports.IntraStrategy = IntraStrategy;
//# sourceMappingURL=intra.strategy.js.map