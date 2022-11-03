import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
        name: 'admin',
        type: 'varchar',
        nullable: false,
    })
    public admin: Array<string>;

    @Column({
        name: 'topic',
        type: 'varchar',
        // nullable: false,
    })
    public topic: string;

    @Column({
        name: 'password',
        type: 'varchar',
        // nullable: false,
    })
    password: string;

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

	@ManyToOne(() => UserEntity, (user) => user.channelBanned, {eager: true})
	@JoinTable()
	banUser: UserEntity[];
}
export default ChanEntity;
