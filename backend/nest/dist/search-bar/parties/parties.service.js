"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartiesService = void 0;
const common_1 = require("@nestjs/common");
let PartiesService = class PartiesService {
    constructor() {
        this.parties = [
            {
                login: "AAA",
                id: 1
            },
            {
                login: "AAA BBB",
                id: 2
            },
            {
                login: "BBB CCC",
                id: 3
            },
            {
                login: "CCC DDD",
                id: 4
            },
            {
                login: "AAA BBB CCC DDD",
                id: 5
            }
        ];
    }
    findAllAvailableParties(name) {
        return JSON.stringify(this.parties.filter(party => party.login.includes(name)));
    }
    findAllParties() {
        return JSON.stringify(this.parties);
    }
};
PartiesService = __decorate([
    (0, common_1.Injectable)()
], PartiesService);
exports.PartiesService = PartiesService;
//# sourceMappingURL=parties.service.js.map