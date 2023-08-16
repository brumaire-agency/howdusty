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

  @Column({ name: 'github_total_pull_requests' })
  githubTotalPullRequests: number;

  @Column({ name: 'github_total_issues' })
  githubTotalIssues: number;

  @Column({ name: 'github_contributed_repository_count' })
  githubContributedRepositoryCount: number;

  @Column({ name: 'github_maintained_repository_count' })
  githubMaintainedRepositoryCount: number;

  @Column({
    name: 'github_issue_pull_request_ratio',
    type: 'decimal',
    precision: 6,
    scale: 2,
  })
  githubIssuePullRequestRatio: number;

  @Column({ name: 'github_active_contribution_weeks' })
  githubActiveContributionWeeks: number;

  @Column({ name: 'onlydust_collected_grant' })
  onlydustCollectedGrant: number;

  @Column({ name: 'onlydust_mean_grant_per_project' })
  onlydustMeanGrantPerProject: number;

  @Column({ name: 'onlydust_contributed_project_count' })
  onlydustContributedProjectCount: number;

  @Column({ name: 'onlydust_contribution_count' })
  onlydustContributionCount: number;

  @Column({
    name: 'onlydust_regularity',
    type: 'decimal',
    precision: 6,
    scale: 2,
  })
  onlydustRegularity: number;

  @OneToOne(() => Contributor, (contributor) => contributor.metrics)
  @JoinColumn()
  contributor: Relation<Contributor>;
}
