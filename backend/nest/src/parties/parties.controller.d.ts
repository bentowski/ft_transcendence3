import { PartiesService } from './parties.service';
import { CreatePartiesDto } from './dto/create-parties.dto';
export declare class PartiesController {
    private readonly partiesService;
    constructor(partiesService: PartiesService);
    findAllAvailableParties(name: string): Promise<import("./entities/parties-entity").PartiesEntity[]>;
    getParties(): Promise<import("./entities/parties-entity").PartiesEntity[]>;
    createParties(createPartiesDto: CreatePartiesDto): Promise<import("./entities/parties-entity").PartiesEntity>;
    remove(username: string): void;
}
