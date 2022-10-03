import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HistoryEntity } from '../../parties/entities/history-entity';
//import {Exclude} from "class-transformer";

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'uuid',
  })
  user_id: bigint;

  @Column()
  auth_id: string;

  @Column({
    unique: true,
    type: 'varchar',
    nullable: false,
  })
  username: string;

  @Column({
    name: 'email',
    type: 'varchar',
    // nullable: false,
  })
  email: string;

  //@Column({
  //  name: 'password',
  //  type: 'varchar',
  //  nullable: false,
  //})
  //@Exclude()
  //password: string;

  @Column({
    default: '',
  })
  avatar: string;

  @Column({
    default: [],
  })
  @OneToMany(() => HistoryEntity, (parties) => parties.game_id)
  parties: HistoryEntity[];

  @Column({
    default: 0,
  })
  game_won: number;

  @Column({
    default: 0,
  })
  game_lost: number;

  @Column({
    default: 0,
  })
  total_games: number;

  @Column({
    default: 0,
  })
  total_score: number;

  @Column({
    default: 0,
  })
  status: number;

  @Column({
    default: [],
  })
  @OneToMany(() => UserEntity, (friends) => friends.user_id)
  friends: UserEntity[];

  @Column({
    default: [],
  })
  conversations: string[];

  @Column({
    default: '',
  })
  authStrategy: string;

  @Column({})
  createdAt: Date;

  constructor(partial: UserEntity[]) {
    Object.assign(this, partial);
  }
}
export default UserEntity;
