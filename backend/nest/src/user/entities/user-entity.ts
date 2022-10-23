import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HistoryEntity } from '../../parties/entities/history-entity';
import { Exclude } from 'class-transformer';
import { ProfileEntity } from './profile-entity';
import { ChanEntity } from '../../chans/entities/chan-entity';

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
  @Exclude()
  secret: string;

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
  })
  authStrategy: string;

  @Column({
    default: () => '((CURRENT_DATE))',
  })
  createdAt: Date;

  @ManyToMany(() => ChanEntity, (chan) => chan.chanUser)
  channelJoined: ChanEntity[]

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
export default UserEntity;
