import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'user_id',
    })
    public id: number;

    @Column({
        nullable: false,
        default: '',
    })
    public username: string;

    @Column({
        name: 'email_address',
        nullable: false,
        default: '',
    })
    public email: string;

    @Column({
        nullable: false,
        default: '',
    })
    password: string;
}
export default User;