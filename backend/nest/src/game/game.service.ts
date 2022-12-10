import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartiesService } from '../parties/parties.service';
import { Room } from './room.interface';

@Injectable()
export class GameService {
 constructor() {}

 rooms: Map<string, Room> = new Map();

 initGame(p1: string, p2: string) {
   let sizeBall = 3;
   // Ajouter fonction random vecteur
   return {
      nbPlayer: 2,
      p1: p1,
      p2: p2,
      ballPos: [50 - (sizeBall / 2), 50],
      player1: [100 - sizeBall, 50],
      player2: [0, 50],
      sizeBall:  sizeBall,
      speed: 10,
      playerSize: sizeBall * 4,
      playerSpeed: 10,
      middle: 50 + (sizeBall / 4),
      vector: [1, 0],
      p1Score: 0,
      p2Score: 0,
   }
 }
}
