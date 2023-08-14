import { Column, Entity, OneToOne, PrimaryColumn, Relation } from 'typeorm';
import { Metrics } from '../metrics/metrics.entity';

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
    name: 'github_score',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  githubScore?: number;

  @Column({ name: 'github_rank', nullable: true })
  githubRank?: number;

  @Column({
    name: 'onlydust_score',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  onlydustScore?: number;

  @Column({ name: 'onlydust_rank', nullable: true })
  onlydustRank?: number;

  @Column({
    name: 'global_score',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  globalScore?: number;

  @Column({ name: 'global_rank', nullable: true })
  globalRank?: number;

  @Column({ name: 'max_rank', nullable: true })
  maxRank?: number;

  @OneToOne(() => Metrics, (metric) => metric.contributor)
  metrics?: Relation<Metrics>;
}
