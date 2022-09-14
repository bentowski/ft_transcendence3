import { Injectable } from '@nestjs/common';

@Injectable()
export class PartiesService {
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
        return JSON.stringify(this.parties.filter(party => party.login.includes(name)));
    }
	findAllParties() {
        return JSON.stringify(this.parties);
        //return this.parties.filter(party => party.login.includes(name));
    }

}
