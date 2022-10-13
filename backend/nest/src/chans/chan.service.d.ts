import { Repository } from 'typeorm';
import { CreateChanDto } from "./dto/create-chan.dto";
import ChanEntity from "./entities/chan-entity";
export declare class ChanService {
    private readonly chanRepository;
    constructor(chanRepository: Repository<ChanEntity>);
    createChan(createChanDto: CreateChanDto): Promise<ChanEntity>;
    findAll(): Promise<ChanEntity[]>;
    findOne(name?: string): Promise<ChanEntity>;
    remove(id: string): Promise<void>;
}
