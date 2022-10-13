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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user-entity");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async validateUser42(user42) {
        let user = undefined;
        user = await this.findOnebyUsername(user42.username);
        console.log('vaildateuser42 username = ' + user42.username);
        if (!user)
            user = await this.createUser42(user42);
        return user;
    }
    async currentUser(user) {
        console.log('set test = ' + user.user_id);
        const foundUser = await this.findOnebyID(user.user_id);
        if (!user)
            throw new common_1.NotFoundException('cant find user');
        return foundUser;
    }
    async createUser42(user42) {
        console.log('creating new user42');
        const user = this.userRepository.create(user42);
        user.friends = [];
        user.username = user42.username;
        return this.userRepository.save(user);
    }
    async createUser(createUserDto) {
        const { auth_id, username, email } = createUserDto;
        let user = undefined;
        user = this.userRepository.create(createUserDto);
        try {
            user.auth_id = auth_id;
            user.username = username;
            user.email = email;
            user.avatar =
                'https://avatars.dicebear.com/api/personas/' + auth_id + '.svg';
            user.createdAt = new Date();
            await this.userRepository.save(user);
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException('cant create user', common_1.HttpStatus.BAD_REQUEST);
        }
        return user;
    }
    async findAll() {
        let users = undefined;
        users = await this.userRepository.find();
        return users;
    }
    async findOnebyUsername(username) {
        let findUsername = undefined;
        findUsername = await this.userRepository.findOneBy({ username });
        return findUsername;
    }
    async updateUser(userId, updateUserDto) {
        let user = undefined;
        user = await this.findOneByAuthId(userId);
        console.log(user);
        const { username, avatar } = updateUserDto;
        if (username)
            user.username = username;
        if (avatar)
            user.avatar = avatar;
        try {
            await this.userRepository.save(user);
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('error while modifying user');
        }
        return user;
    }
    async remove(id) {
        await this.userRepository.delete(id);
    }
    async findOneByAuthId(auth_id) {
        let findAuthId = undefined;
        findAuthId = await this.userRepository.findOneBy({ auth_id });
        return findAuthId;
    }
    async findOnebyID(user_id) {
        let findId = undefined;
        findId = await this.userRepository.findOneBy({ user_id });
        return findId;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map