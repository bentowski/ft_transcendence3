import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HistoryEntity } from '../../parties/entities/history-entity';
import { Exclude } from 'class-transformer';
import { ProfileEntity } from './profile-entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  user_id: string;

  @Column({ default: '' })
  auth_id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    unique: true,
    default: '',
  })
  email: string;

  @Column({
    default: '',
  })
  avatar: string;

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

  @OneToMany(() => UserEntity, (friends) => friends.user_id)
  friends: UserEntity[];

  @OneToOne(() => UserEntity, (profile) => profile.username)
  profile: ProfileEntity;

  @Column({
    default: '',
    nullable: true,
  })
  @Exclude()
  twoFASecret: string;

  @Column({
    default: 0,
  })
  isTwoFA: number;

  @Column({
    default: () => '((CURRENT_DATE))',
  })
  createdAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
export default UserEntity;
