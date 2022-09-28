import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'uuid',
    })
    public id: bigint;

    @Column({
        unique: true,
        type: 'varchar',
        nullable: false,
    })
    public username: string;

    @Column({
        name: 'email',
        type: 'varchar',
        // nullable: false,
    })
    public email: string;

    @Column({
        name: 'password',
        type: 'varchar',
        // nullable: false,
    })
    password: string;
}
export default UserEntity;
