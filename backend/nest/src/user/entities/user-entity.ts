import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { HistoryEntity } from '../../parties/entities/history-entity';
import {
  Exclude,
  Expose,
  Type
} from 'class-transformer';
import { ChanEntity } from '../../chans/entities/chan-entity';
// import { ProfileEntity } from './profile-entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  user_id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  auth_id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    unique: true,
    nullable: false,
    update: false,
  })
  email: string;

  @Column({
    default: 'default.jpg',
  })
  avatar: string;

  @OneToMany(() => HistoryEntity, (parties) => parties.game_id)
  parties: HistoryEntity[];

  @Column({
    type: 'int',
    default: 0,
  })
  game_won: number;

  @Column({
    default: 0,
    type: 'int',
  })
  game_lost: number;

  @Column({
    type: 'int',
    default: 0,
  })
  total_games: number;

  @Column({
    type: 'int',
    default: 0,
  })
  total_score: number;

  @Column({
    type: 'int',
    default: 0,
  })
  status: number;

  /*
  @Type(() => UserEntity)
  @JoinTable({ name: 'users_id_1' })
  @ManyToMany(() => UserEntity, {
    cascade: true,
  })
  */
  @Column('simple-array', { default: [] })
  friends: string[];

  /*
  @Type(() => UserEntity)
  @JoinTable({ joinColumn: { name: 'UserEntity_blocked_id_1' } })
  @ManyToMany(() => UserEntity, { cascade: true })
  */
  @Column('simple-array', { default: [] })
  blocked: string[];

  @Exclude()
  @Column({
    default: '',
    nullable: true,
  })
  twoFASecret: string;

  @Column({
    default: 0,
  })
  isTwoFA: number;

  @Column({
    default: () => '((CURRENT_DATE))',
    update: false,
  })
  createdAt: Date;

  @ManyToMany(() => ChanEntity, (chan) => chan.chanUser)
  channelJoined: ChanEntity[];

  @ManyToMany(() => ChanEntity, (chan) => chan.banUser)
  channelBanned: ChanEntity[];

  @ManyToMany(() => ChanEntity, (chan) => chan.muteUser)
  channelMuted: ChanEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
export default UserEntity;
