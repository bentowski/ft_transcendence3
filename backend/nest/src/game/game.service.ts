import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartiesService } from '../parties/parties.service';

@Injectable()
export class GameService {
 constructor() {}


 initGame(p1: string, p2: string) {
   let sizeBall = 5;
   // Ajouter fonction random vecteur
   return {
      nbPlayer: 2,
      p1Name: p1,
      p2Name: p2,
      ballPos: [50, 50],
      player1: [100, 50],
      player2: [0 + (sizeBall / 2), 50],
      sizeBall:  sizeBall,
      speed: 10,
      playerSize: 20,
      playerSpeed: 10,
      middle: 50 - sizeBall / 10,
      vector: [1, 0],
      p1Score: 0,
      p2Score: 0,
   }
 }
}
