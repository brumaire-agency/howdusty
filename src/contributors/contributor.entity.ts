import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Metricable } from '@/metrics';

@Entity('contributors')
export class Contributor implements Metricable {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'avatar_url' })
  avatarUrl: string;

  @Column({ name: 'total_contributions' })
  totalContributions: number;

  @Column({ name: 'contributed_repository_count' })
  contributedRepositoryCount: number;

  @Column({ name: 'maintained_repository_count' })
  maintainedRepositoryCount: number;

  @Column({
    name: 'issue_pull_request_ratio',
    type: 'decimal',
    precision: 6,
    scale: 2,
  })
  issuePullRequestRatio: number;

  @Column({ name: 'active_contribution_weeks' })
  activeContributionWeeks: number;

  @Column({ name: 'collected_grant' })
  collectedGrant: number;

  @Column({ name: 'contributed_project_count' })
  contributedProjectCount: number;

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
