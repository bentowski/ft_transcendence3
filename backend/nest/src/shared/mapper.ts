import UserEntity from "../user/entities/user-entity";
import ChanEntity from "../chans/entities/chan-entity";
import { UserDto } from "../user/dto/user.dto";
import { ChanDto } from "../chans/dto/chan.dto";

/* theses functions will allow data mapping between frontend and
* backend. will be called in service, map dto to entity */

export const toUserDto = (data: UserEntity): UserDto => {
    const { id, username, email } = data;
    // let id: bigint = BigInt(id)
    let userDto: UserDto = { id, username, email, };
    return userDto;
}

export const toChanDto = (data: ChanEntity): ChanDto => {
    const { id, name, topic } = data;
    // let id: bigint = BigInt(id)
    let chanDto: ChanDto = { id, name, topic, };
    return chanDto;
}
