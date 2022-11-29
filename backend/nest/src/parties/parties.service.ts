import { Injectable } from '@nestjs/common';
import PartiesEntity from './entities/parties-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartiesDto } from "./dto/create-parties.dto";
import { HistoryEntity } from './entities/history-entity';
import { HistorySavePartiesDto } from './dto/history-save-parties.dto';
import * as io from "socket.io-client";

const update = io.connect("http://localhost:3000/update");

@Injectable()
export class PartiesService {

    constructor(
        @InjectRepository(PartiesEntity)
        private readonly partiesRepository: Repository<PartiesEntity>,
        @InjectRepository(HistoryEntity)
        private readonly historyRepository: Repository<HistoryEntity>,
    ) { }

    async findAllAvailableParties(login: string) {
        //return 'Hello World';
        // return JSON.stringify(this.parties.filter(parties => parties.login.includes(name)));
        let parties = await this.partiesRepository.find();
        return parties.filter(parties => parties.login.includes(login));
    }
    findParties(): Promise<PartiesEntity[]> {
        //return JSON.stringify(this.parties);
        return this.partiesRepository.find();
        //return this.parties.filter(parties => parties.login.includes(name));
    }

    createPartiesEntity(createPartiesDto: CreatePartiesDto): Promise<PartiesEntity> {
        const parties: PartiesEntity = new PartiesEntity();

        parties.id = createPartiesDto.id;
        parties.login = createPartiesDto.login;
        parties.nbPlayers = createPartiesDto.nbPlayers;

        return this.partiesRepository.save(createPartiesDto);
    }

    remove(id: string) {
        this.partiesRepository.delete(id);
    }

    findHistories(): Promise<HistoryEntity[]> {
        return this.historyRepository.find();
    }

    async createHistories(historySavePartiesDto: HistorySavePartiesDto): Promise<HistoryEntity> {
        const { user_one, user_two, score_one, score_two } = historySavePartiesDto;
        const histories: HistoryEntity = this.historyRepository.create(historySavePartiesDto);

        histories.user_one = user_one;
        histories.user_two = user_two;
        histories.score_one = score_one;
        histories.score_two = score_two;
        // if (histories.score_one > histories.score_two) {
        //     histories.winner = histories.user_one;
        //     histories.looser = histories.user_two;
        // }
        // else if (histories.score_one < histories.score_two) {
        //     histories.winner = histories.user_two;
        //     histories.looser = histories.user_one;
        // }
        histories.createdAt = new Date();
        await this.historyRepository.save(histories)
        return histories;

    }

    async addToGame(id: string, auth_id: string) {
        let game = await this.partiesRepository.findOne({
            where : { id: Number(id)}
        })
        if (game.p1 === null) {
            game.p1 = auth_id;
			update.emit('newParty');
            update.emit('updateUser', { auth_id: auth_id, status: 2 })
		}
        else if (game.p1 === auth_id)
            return ;
        else if (game.p2 === null) {
            game.p2 = auth_id;
			update.emit('newParty');
            update.emit('updateUser', { auth_id: auth_id, status: 2 })
		}
        await this.partiesRepository.save(game);
    }
}
