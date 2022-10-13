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
var ProfileEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileEntity = void 0;
const typeorm_1 = require("typeorm");
let ProfileEntity = ProfileEntity_1 = class ProfileEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], ProfileEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProfileEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => ProfileEntity_1, (user) => user.username),
    __metadata("design:type", ProfileEntity)
], ProfileEntity.prototype, "profile", void 0);
ProfileEntity = ProfileEntity_1 = __decorate([
    (0, typeorm_1.Entity)()
], ProfileEntity);
exports.ProfileEntity = ProfileEntity;
//# sourceMappingURL=profile-entity.js.map