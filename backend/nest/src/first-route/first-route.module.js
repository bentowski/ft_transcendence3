"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstRouteModule = void 0;
const common_1 = require("@nestjs/common");
const first_route_controller_1 = require("./first-route.controller");
const first_route_service_1 = require("./first-route.service");
let FirstRouteModule = class FirstRouteModule {
};
FirstRouteModule = __decorate([
    (0, common_1.Module)({
        controllers: [first_route_controller_1.FirstRouteController],
        providers: [first_route_service_1.FirstRouteService]
    })
], FirstRouteModule);
exports.FirstRouteModule = FirstRouteModule;
//# sourceMappingURL=first-route.module.js.map