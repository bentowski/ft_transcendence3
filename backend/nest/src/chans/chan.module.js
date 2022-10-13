"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChanModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chan_service_1 = require("./chan.service");
const chan_controller_1 = require("./chan.controller");
const chan_entity_1 = require("./entities/chan-entity");
let ChanModule = class ChanModule {
};
ChanModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([chan_entity_1.ChanEntity])],
        providers: [chan_service_1.ChanService],
        controllers: [chan_controller_1.ChanController],
        exports: [typeorm_1.TypeOrmModule]
    })
], ChanModule);
exports.ChanModule = ChanModule;
//# sourceMappingURL=chan.module.js.map