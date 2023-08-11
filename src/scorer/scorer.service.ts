import { Injectable } from '@nestjs/common';
import { NormalizationService } from '@/scorer/normalization.service';
import { Contributor, ContributorOldModel } from '@/contributors';
import { orderBy } from 'lodash';
import { Metricable, MetricName } from '@/metrics';

@Injectable()
export class ScorerService {
  private weights: Metricable = {
    [MetricName.githubTotalPullRequests]: 1,
    [MetricName.githubTotalIssues]: 1,
    [MetricName.githubContributedRepositoryCount]: 1,
    [MetricName.githubMaintainedRepositoryCount]: 1,
    [MetricName.githubIssuePullRequestRatio]: 1,
    [MetricName.githubActiveContributionWeeks]: 1,
    [MetricName.onlydustCollectedGrant]: 1,
    [MetricName.onlydustMeanGrantPerProject]: 1,
    [MetricName.onlydustContributedProjectCount]: 1,
    [MetricName.onlydustContributionCount]: 1,
  };

  /**
   * The class constructor.
   */
  constructor(private normalizer: NormalizationService) {}

  /**
   * Score a set of contributors.
   */
  score(contributors: ContributorOldModel[]): ContributorOldModel[] {
    const metrics = Object.keys(this.weights);
    const normalized = this.normalizer.normalize(
      contributors,
      metrics as MetricName[],
    );

    const scored = normalized.map((row, index) => ({
      ...contributors[index],
      score: Object.keys(row).reduce(
        (score, label) => score + row[label] * this.weights[label],
        0,
      ),
    }));

    return orderBy(scored, 'score', 'desc').map((contributor, index) => ({
      ...contributor,
      rank: index + 1,
    }));
  }
}
