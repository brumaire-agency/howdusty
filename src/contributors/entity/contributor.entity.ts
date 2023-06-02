import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contributors')
export class Contributor {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column({ name: 'avatar_url' })
  avatarUrl: string;
}
