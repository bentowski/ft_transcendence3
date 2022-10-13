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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const intra_auth_guard_1 = require("./guards/intra-auth.guard");
const jwt_1 = require("@nestjs/jwt");
let AuthController = class AuthController {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    login() {
        return;
    }
    async redirect(res, req) {
        console.log('successful login thru 42 api');
        const username = req.user['username'];
        const auth_id = req.user['auth_id'];
        const status = 0;
        const payload = { auth_id, username, status };
        const access_token = await this.jwtService.sign(payload);
        console.log(res.cookie);
        res.cookie('jwt', access_token, { httpOnly: true });
        res.redirect('http://localhost:8080');
    }
    status(req) {
        console.log('get status user');
        return req.user;
    }
    logout() {
        console.log('logout user');
        return;
    }
};
__decorate([
    (0, common_1.Get)('login'),
    (0, common_1.UseGuards)(intra_auth_guard_1.IntraAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('redirect'),
    (0, common_1.UseGuards)(intra_auth_guard_1.IntraAuthGuard),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "redirect", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "status", null);
__decorate([
    (0, common_1.Get)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map