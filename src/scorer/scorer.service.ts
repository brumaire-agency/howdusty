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
