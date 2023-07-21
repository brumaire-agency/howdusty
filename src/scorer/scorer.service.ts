import { Injectable } from '@nestjs/common';
import { NormalizationService } from '@/scorer/normalization.service';
import { Contributor } from '@/contributors';
import { orderBy } from 'lodash';
import { Metricable, MetricName } from '@/metrics';

@Injectable()
export class ScorerService {
  private weights: Metricable = {
    [MetricName.totalContributions]: 1,
    [MetricName.contributedRepositoryCount]: 1,
    [MetricName.maintainedRepositoryCount]: 1,
    [MetricName.issuePullRequestRatio]: 1,
    [MetricName.activeContributionWeeks]: 1,
    [MetricName.collectedGrant]: 1,
    [MetricName.meanGrantPerProject]: 1,
  };

  /**
   * The class constructor.
   */
  constructor(private normalizer: NormalizationService) {}

  /**
   * Score a set of contributors.
   */
  score(contributors: Contributor[]): Contributor[] {
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
