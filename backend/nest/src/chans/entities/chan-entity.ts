import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user-entity'

type Msg = {
	content: string;
	sender_socket_id: string;
	username: string;
	avatar: string;
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
				nullable: false,
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

	@ManyToMany(() => UserEntity, (user) => user.channelJoined, {eager: true})
	@JoinTable()
	chanUser: UserEntity[];

	@ManyToMany(() => UserEntity, (user) => user.channelBanned, {eager: true})
	@JoinTable()
	banUser: UserEntity[];
}
export default ChanEntity;
