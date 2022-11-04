import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { HistoryEntity } from '../../parties/entities/history-entity';
import { Exclude } from 'class-transformer';
// import { ProfileEntity } from './profile-entity';
import { ChanEntity } from '../../chans/entities/chan-entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  user_id: string;

  @Column({ nullable: false, unique: true })
  auth_id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    default: 'default.jpg',
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

  @ManyToMany(() => UserEntity, (friend) => friend.friends, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'Friends' })
  friends: UserEntity[];

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

  @ManyToMany(() => ChanEntity, (chan) => chan.chanUser)
  channelJoined: ChanEntity[];

  @ManyToMany(() => ChanEntity, (chan) => chan.banUser)
  channelBanned: ChanEntity[]

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
export default UserEntity;
