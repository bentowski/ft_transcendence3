import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from '../../user/entities/user-entity';

@Entity('histrories')
export class HistoryEntity {
  @PrimaryGeneratedColumn()
  game_id: bigint;

  @Column({
    default: '',
  })
  user_one: string;

  @Column({
    default: '',
  })
  user_two: string;

  @Column({
    default: 0,
  })
  score_one: number;

  @Column({
    default: 0,
  })
  score_two: number;

  // @Column({
  //   default: '',
  // })
  // final_score: string;

  // @Column({
  //   default: '',
  // })
  // winner: string;

  // @Column({
  //   default: '',
  // })
  // looser: string;

  @Column({
    default: () => '((CURRENT_DATE))',
  })
  createdAt: Date;

  @ManyToMany(() => UserEntity, (user) => user.parties)
  users: UserEntity[];

  constructor(partial: Partial<HistoryEntity>) {
    Object.assign(this, partial);
  }
}

export default HistoryEntity;
