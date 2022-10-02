import UserEntity from "../user/entities/user-entity";
import { UserDto } from "../user/dto/user.dto";

/* theses functions will allow data mapping between frontend and
* backend. will be called in service, map dto to entity */

export const toUserDto = (data: UserEntity): UserDto => {
    const { id, username, email } = data;
    // let id: bigint = BigInt(id)
    let userDto: UserDto = { id, username, email, };
    return userDto;
}
