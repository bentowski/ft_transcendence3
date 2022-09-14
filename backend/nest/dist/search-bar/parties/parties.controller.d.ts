import { PartiesService } from './parties.service';
export declare class PartiesController {
    private readonly partiesService;
    constructor(partiesService: PartiesService);
    findAllAvailableParties(name: string): string;
    findAllParties(): string;
}
