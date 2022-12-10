import { UserEntity } from './entities/user-entity';

export interface Position {
  x: number;
  y: number;
}

interface Ball {
  position: Position;
  velocity: Position;
}

export enum State {
  WAITING,
  STARTING,
  COUNTDOWN,
  INGAME,
  END,
}

export interface Room {
  code: string;
  state: State;
  players: Array<UserEntity>;
  spectators?: Array<UserEntity>;
  ball: Ball;
  speed: number;
}
