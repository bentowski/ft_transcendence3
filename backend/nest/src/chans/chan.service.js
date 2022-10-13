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
exports.ChanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chan_entity_1 = require("./entities/chan-entity");
const argon2 = require("argon2");
let ChanService = class ChanService {
    constructor(chanRepository) {
        this.chanRepository = chanRepository;
    }
    async createChan(createChanDto) {
        let { name, type, password, admin, topic } = createChanDto;
        password = await argon2.hash(password);
        const chanInDb = await this.chanRepository.findOne({
            where: { name }
        });
        if (chanInDb) {
            throw new common_1.HttpException('Chan already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const chan = await this.chanRepository.create({
            name, type, password, admin, topic,
        });
        await this.chanRepository.save(chan);
        return chan;
    }
    findAll() {
        return this.chanRepository.find();
    }
    async findOne(name) {
        const chan = await this.chanRepository.findOneBy({ name });
        return chan;
    }
    async remove(id) {
        await this.chanRepository.delete(id);
    }
};
ChanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chan_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChanService);
exports.ChanService = ChanService;
//# sourceMappingURL=chan.service.js.map