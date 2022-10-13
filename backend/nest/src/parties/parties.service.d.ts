import PartiesEntity from './entities/parties-entity';
import { Repository } from 'typeorm';
import { CreatePartiesDto } from "./dto/create-parties.dto";
export declare class PartiesService {
    private readonly partiesRepository;
    constructor(partiesRepository: Repository<PartiesEntity>);
    findAllAvailableParties(login: string): Promise<PartiesEntity[]>;
    findParties(): Promise<PartiesEntity[]>;
    createPartiesEntity(createPartiesDto: CreatePartiesDto): Promise<PartiesEntity>;
    remove(id: string): void;
}
