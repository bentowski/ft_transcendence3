import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartiesService } from '../parties/parties.service';

@Injectable()
export class GameService {
 constructor(
   // @InjectRepository(Chat) private chatRepository: Repository<Chat>,
 ) {}
 // async createMessage(chat: Chat): Promise<Chat> {
 //   return await this.chatRepository.save(chat);
 // }
 //
 // async getMessages(): Promise<Chat[]> {
 //   return await this.chatRepository.find();
 // }

 initGame(p1: string, p2: string) {
   let sizeBall = 5;
   // Ajouter fonction random vecteur
   return {
      nbPlayer: 2,
      playerSize: 20,
      p1Name: p1,
      p2Name: p2,
      player1: [100 - (sizeBall / 2), 50],
      player2: [0 + (sizeBall / 2), 50],
      playerSpeed: 10,
      sizeBall:  sizeBall,
      ballPos: [50, 50],
      vector: [1, 0],
      speed: 10,
      middle: 50,
      p1Score: 0,
      p2Score: 0,
   }
 }
}
