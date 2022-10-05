import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chan')
export class ChanEntity {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'uuid',
    })
    public id: string;

    @Column({
        unique: true,
        type: 'varchar',
        nullable: false,
    })
    public name: string;

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
