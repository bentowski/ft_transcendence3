import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
export default ChanEntity;
