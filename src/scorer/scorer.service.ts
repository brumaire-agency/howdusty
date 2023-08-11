import { Injectable } from '@nestjs/common';
import { NormalizationService } from '@/scorer/normalization.service';
import { Contributor, ContributorOldModel } from '@/contributors';
import { orderBy } from 'lodash';
import { Metricable, MetricName } from '@/metrics';

@Injectable()
export class ScorerService {
  private weights: Metricable = {
    [MetricName.totalPullRequests]: 1,
    [MetricName.totalIssues]: 1,
    [MetricName.contributedRepositoryCount]: 1,
    [MetricName.maintainedRepositoryCount]: 1,
    [MetricName.issuePullRequestRatio]: 1,
    [MetricName.activeContributionWeeks]: 1,
    [MetricName.collectedGrant]: 1,
    [MetricName.meanGrantPerProject]: 1,
    [MetricName.contributedProjectCount]: 1,
    [MetricName.contributionCount]: 1,
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

    const scored = normalized.map((row, index) => {
      const githubScore = this.calculateScore(row, [
        MetricName.totalPullRequests,
        MetricName.totalIssues,
        MetricName.contributedRepositoryCount,
        MetricName.maintainedRepositoryCount,
        MetricName.issuePullRequestRatio,
        MetricName.activeContributionWeeks,
      ]);
      const onlydustScore = this.calculateScore(row, [
        MetricName.collectedGrant,
        MetricName.meanGrantPerProject,
        MetricName.contributedProjectCount,
        MetricName.contributionCount,
      ]);
      const globalScore = this.calculateScore(row, metrics as MetricName[]);

      return {
        ...contributors[index],
        githubScore,
        onlydustScore,
        globalScore,
      };
    });

    const rankedScores = {
      github: orderBy(scored, 'githubScore', 'desc'),
      onlydust: orderBy(scored, 'onlydustScore', 'desc'),
      global: orderBy(scored, 'globalScore', 'desc'),
    };

    const rankedContributors = scored.map((contributor) => ({
      ...contributor,
      githubRank: this.findRank(contributor, rankedScores.github),
      onlydustRank: this.findRank(contributor, rankedScores.onlydust),
      globalRank: this.findRank(contributor, rankedScores.global),
    }));

    return rankedContributors;
  }

  calculateScore(
    row: Record<string, number>,
    includedMetrics: MetricName[],
  ): number {
    return includedMetrics.reduce(
      (score, label) => score + row[label] * this.weights[label],
      0,
    );
  }

  findRank(
    contributor: ContributorOldModel,
    rankedScores: ContributorOldModel[],
  ): number {
    return rankedScores.findIndex((c) => c.id === contributor.id) + 1;
  }
}
