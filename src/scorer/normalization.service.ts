import { Injectable } from '@nestjs/common';
import { Contributor, ContributorOldModel } from '@/contributors';
import { StandardScaler } from './standard-scaler.service';
import { MetricName } from '@/metrics';

/**
 * The normalization service.
 *
 * This service is responsible for normalizing contributors into an exploitable
 * format. It exposes a single "normalize" method performing this operation. The
 * contributor data are scalar values with different scales. The goal of this
 * normalization is to reduce every feature to the same scale, similar to a
 * known machine-learning process named "feature scaling". This allows the
 * scorer to manipulate different features on the same scale to compute scores
 * using different algorithms such as linear regression.
 */
@Injectable()
export class NormalizationService {
  /**
   * The class constructor.
   */
  constructor(private scaler: StandardScaler) {}

  /**
   * Normalize a set of contributors.
   */
  public normalize(
    contributors: ContributorOldModel[],
    metrics: MetricName[],
  ): Record<string, number>[] {
    // convert the set of contributor to a dataset of scalars
    const dataset = contributors.map((contributor) =>
      this.contributorToRecord(contributor, metrics),
    );

    // scale the dataset
    return this.scaler.scale(dataset);
  }

  /**
   * Converts a contributor to a string/number record.
   *
   * This function iterates over the contributor keys, selects the keys matching
   * a number and builds a record off it.
   */
  private contributorToRecord(
    contributor: ContributorOldModel,
    metrics: MetricName[],
  ): Record<string, number> {
    return Object.keys(contributor)
      .filter((key) => metrics.includes(key as MetricName))
      .reduce((record, key) => ({ ...record, [key]: contributor[key] }), {});
  }
}
