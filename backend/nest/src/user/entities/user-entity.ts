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

  @Column()
  avatar: string;

  @Column()
  @OneToMany(() => HistoryEntity, (parties) => parties.game_id)
  parties: HistoryEntity[];

  @Column()
  game_won: number;

  @Column()
  game_lost: number;

  @Column()
  total_games: number;

  @Column()
  total_score: number;

  @Column()
  status: number;

  @Column()
  @OneToMany(() => UserEntity, (friends) => friends.user_id)
  friends: UserEntity[];

  @Column()
  conversations: string[];

  @Column()
  AuthStrategy: string;

  @Column()
  CreatedAt: Date;

  constructor(partial: UserEntity[]) {
    Object.assign(this, partial);
  }
}
export default UserEntity;
