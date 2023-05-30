import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contributors')
export class Contributor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column({ name: 'avatar_url' })
  avatarUrl: string;
}
