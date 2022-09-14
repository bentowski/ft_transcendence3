import { AvailableChanService } from './available-chan.service';
export declare class AvailableChanController {
    private readonly availableChanService;
    constructor(availableChanService: AvailableChanService);
    findOneChan(name: string): any;
    findAllAvailableChannel(): any[];
}
