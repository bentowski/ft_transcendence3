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
var UserEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
const history_entity_1 = require("../../parties/entities/history-entity");
const class_transformer_1 = require("class-transformer");
const profile_entity_1 = require("./profile-entity");
let UserEntity = UserEntity_1 = class UserEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], UserEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], UserEntity.prototype, "auth_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
        nullable: false,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
        default: '',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UserEntity.prototype, "secret", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => history_entity_1.HistoryEntity, (parties) => parties.game_id),
    __metadata("design:type", Array)
], UserEntity.prototype, "parties", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "game_won", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "game_lost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "total_games", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "total_score", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserEntity_1, (friends) => friends.user_id),
    __metadata("design:type", Array)
], UserEntity.prototype, "friends", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => UserEntity_1, (profile) => profile.username),
    __metadata("design:type", profile_entity_1.ProfileEntity)
], UserEntity.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: '',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "authStrategy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: () => '((CURRENT_DATE))',
    }),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
UserEntity = UserEntity_1 = __decorate([
    (0, typeorm_1.Entity)('user'),
    __metadata("design:paramtypes", [Object])
], UserEntity);
exports.UserEntity = UserEntity;
exports.default = UserEntity;
//# sourceMappingURL=user-entity.js.map