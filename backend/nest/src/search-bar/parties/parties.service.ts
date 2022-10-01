import { Injectable } from '@nestjs/common';
import PartiesEntity from './entities/parties-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartiesDto } from "./dto/create-parties.dto";

@Injectable()
export class PartiesService {

	constructor(
        @InjectRepository(PartiesEntity)
        private readonly partiesRepository: Repository<PartiesEntity>,
    ) {}

    parties: any[] = [
        {
            login: "AAA",
			id: 1
        },
        {
            login: "AAA BBB",
			id: 2
        },
        {
            login: "BBB CCC",
			id: 3
        },
        {
            login: "CCC DDD",
			id: 4
        },
        {
            login: "AAA BBB CCC DDD",
			id: 5
        }
    ];

    findAllAvailableParties(name: string) {
        //return 'Hello World';
        return JSON.stringify(this.parties.filter(parties => parties.login.includes(name)));
    }
	findParties() {
        return JSON.stringify(this.parties);
        //return JSON.stringify(this.partiesRepository.find());
        //return this.parties.filter(parties => parties.login.includes(name));
    }

	createPartiesEntity(createPartiesDto: CreatePartiesDto): Promise<PartiesEntity> {
        const parties: PartiesEntity = new PartiesEntity();

        parties.id = createPartiesDto.id;
        parties.login = createPartiesDto.login;

        return this.partiesRepository.save(createPartiesDto);
    }

	async remove(id: string): Promise<void> {
        await this.partiesRepository.delete(id);
    }

}