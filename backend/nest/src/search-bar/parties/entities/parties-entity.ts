import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'parties' })
export class PartiesEntity {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'party_id',
    })
    public id: number;

    @Column({
        nullable: false,
    })
    public login: string;
}
export default PartiesEntity;