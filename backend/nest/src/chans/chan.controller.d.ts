import { ChanService } from "./chan.service";
import { CreateChanDto } from "./dto/create-chan.dto";
export declare class ChanController {
    private readonly chanService;
    constructor(chanService: ChanService);
    getChans(): Promise<import("./entities/chan-entity").ChanEntity[]>;
    findOne(username: string): Promise<import("./entities/chan-entity").ChanEntity>;
    createChan(createUserDto: CreateChanDto): Promise<import("./entities/chan-entity").ChanEntity>;
    remove(username: string): Promise<void>;
}
