import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class HistoryEntity {
  @PrimaryGeneratedColumn()
  game_id: bigint;

  @Column()
  user_one: string;

  @Column()
  user_two: string;

  @Column()
  final_score: string;

  @Column()
  winner: string;

  @Column()
  looser: string;

  @Column()
  createdAt: Date;
}
