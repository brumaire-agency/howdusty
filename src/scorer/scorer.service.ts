import { Injectable } from '@nestjs/common';
import { NormalizationService } from '@/scorer/normalization.service';
import { Contributor } from '@/contributors';
import { orderBy } from 'lodash';

@Injectable()
export class Scorer {
  private weights = {
    totalContributions: 1,
    contributedRepositoryCount: 1,
    maintainedRepositoryCount: 1,
  };

  /**
   * The class constructor.
   */
  constructor(private normalizer: NormalizationService) {}

  /**
   * Score a set of contributors.
   */
  score(contributors: Contributor[]): Record<string, number>[] {
    const normalized = this.normalizer.normalize(contributors);

    const scored = normalized.map((row) => ({
      ...row,
      score: Object.keys(row).reduce(
        (score, label) => score + row[label] * this.weights[label],
        0,
      ),
    }));

    const ranked = orderBy(scored, 'score', 'desc').map(
      (contributor, index) => ({ ...contributor, rank: index + 1 }),
    );

    return ranked;
  }
}
