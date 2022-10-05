import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HistoryEntity } from '../../parties/entities/history-entity';
import { Exclude } from 'class-transformer';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  user_id: string;

  @Column({ nullable: false })
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

  @Column({
    nullable: false,
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

  @Column({
    default: '',
  })
  authStrategy: string;

  @Column({
    default: () => '((CURRENT_DATE))',
  })
  createdAt: Date;
}
export default UserEntity;
