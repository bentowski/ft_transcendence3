import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user-entity'

type Msg = {
	content: string;
	sender_socket_id: string;
	username: string;
	avatar: string;
    auth_id: string;
	room: string;
};

@Entity('chan')
export class ChanEntity {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'uuid',
    })
    public id: string;

    @Column({
        name: 'type',
        type: 'varchar',
        //nullable: false,
    })
    type: string;

    @Column({
        unique: true,
        type: 'varchar',
        nullable: false,
    })
    public name: string;

	@Column({
		name: 'owner',
		type: 'varchar',
		nullable: true,
	})
	public owner: string;

    @Column({
        name: 'password',
        type: 'varchar',
    })
    password: string;

  @Column({
      name: 'admin',
      type: 'varchar',
      array: true,
      nullable: true,
  })
  public admin: Array<string>;

	@Column({
		name: 'messages',
        type: 'varchar',
		array: true,
		//default: '',
		nullable: true,
	})
	messages: Msg[];

	@ManyToMany(() => UserEntity, (user) => user.channelJoined, {
        //cascade: true,
        onDelete: 'CASCADE',
    })
	@JoinTable()
	chanUser: UserEntity[];

	@ManyToMany(() => UserEntity, (user) => user.channelBanned, {
        //cascade: true,
        onDelete: 'CASCADE',
    })
	@JoinTable()
	banUser: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.channelMuted, {
        //cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinTable()
    muteUser: UserEntity[];
}
export default ChanEntity;
