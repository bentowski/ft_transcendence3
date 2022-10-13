"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableChanService = void 0;
const common_1 = require("@nestjs/common");
let AvailableChanService = class AvailableChanService {
    constructor() {
        this.channels = [
            {
                name: "yolo",
                status: "protected",
                password: "psswd",
                administrator: "administrator_id",
                users: {
                    user1: "userid1",
                    user2: "userid2",
                    user3: "userid3"
                }
            },
            {
                name: "patate",
                status: "public",
                password: "",
                administrator: "administrator_id",
                users: {
                    user1: "userid1",
                    user2: "userid2",
                    user3: "userid3"
                }
            }
        ];
    }
    findOneChan(name) {
        return this.channels.find(chan => chan.name === name);
    }
    findAllAvailableChannel() {
        return this.channels;
    }
};
AvailableChanService = __decorate([
    (0, common_1.Injectable)()
], AvailableChanService);
exports.AvailableChanService = AvailableChanService;
//# sourceMappingURL=available-chan.service.js.map