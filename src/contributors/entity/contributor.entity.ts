import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contributors')
export class ContributorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  avatar_url: string;
}
