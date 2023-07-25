import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Metricable } from '@/metrics';

@Entity('contributors')
export class Contributor {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'avatar_url' })
  avatarUrl: string;

  @Column({
    name: 'score',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  score?: number;

  @Column({ nullable: true })
  rank?: number;
}
