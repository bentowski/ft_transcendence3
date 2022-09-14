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
exports.PartiesController = void 0;
const common_1 = require("@nestjs/common");
const parties_service_1 = require("./parties.service");
let PartiesController = class PartiesController {
    constructor(partiesService) {
        this.partiesService = partiesService;
    }
    findAllAvailableParties(name) {
        return (this.partiesService.findAllAvailableParties(name));
    }
    findAllParties() {
        return (this.partiesService.findAllParties());
    }
};
__decorate([
    (0, common_1.Get)(':name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartiesController.prototype, "findAllAvailableParties", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PartiesController.prototype, "findAllParties", null);
PartiesController = __decorate([
    (0, common_1.Controller)('search-bar/parties'),
    __metadata("design:paramtypes", [parties_service_1.PartiesService])
], PartiesController);
exports.PartiesController = PartiesController;
//# sourceMappingURL=parties.controller.js.map