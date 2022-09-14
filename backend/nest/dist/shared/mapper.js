"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserDto = void 0;
const toUserDto = (data) => {
    const { id, username, email } = data;
    let userDto = { id, username, email, };
    return userDto;
};
exports.toUserDto = toUserDto;
//# sourceMappingURL=mapper.js.map