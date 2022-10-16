import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @OneToOne(() => ProfileEntity, (user) => user.username)
  profile: ProfileEntity;
}
