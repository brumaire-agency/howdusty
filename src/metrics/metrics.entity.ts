import {
  Column,
  Entity,
  OneToOne,
  PrimaryColumn,
  JoinColumn,
  Relation,
} from 'typeorm';
import { Contributor } from '../contributors/contributor.entity';
import { Metricable } from './metricable';

@Entity('metrics')
export class Metrics implements Metricable {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'total_pull_requests' })
  totalPullRequests: number;

  @Column({ name: 'total_issues' })
  totalIssues: number;

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

  @Column({ name: 'mean_grant_per_project' })
  meanGrantPerProject: number;

  @Column({ name: 'contributed_project_count' })
  contributedProjectCount: number;

  @Column({ name: 'contribution_count' })
  contributionCount: number;

  @OneToOne(() => Contributor, (contributor) => contributor.metrics)
  @JoinColumn()
  contributor: Relation<Contributor>;
}
