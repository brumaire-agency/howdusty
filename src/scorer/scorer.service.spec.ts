import { Test } from '@nestjs/testing';
import {
  Contributor,
  ContributorFactory,
  ContributorOldModel,
} from '@/contributors';
import { ScorerService } from './scorer.service';
import { StandardScaler } from './standard-scaler.service';
import { NormalizationService } from './normalization.service';
import { faker } from '@faker-js/faker';
import { sortBy } from 'lodash';
import { MetricsFactory } from '@/metrics';

describe('Scorer', () => {
  /**
   * The scorer service.
   */
  let service: ScorerService;

  /**
   * Creates a new scorer service before each test.
   */
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NormalizationService, StandardScaler, ScorerService],
    }).compile();

    service = module.get(ScorerService);
  });

  describe('score', () => {
    it('should score a set of contributors', () => {
      faker.seed(42);
      const contributors = ContributorFactory.generateMany(10);
      const metrics = MetricsFactory.generateMany(10);

      const scored = service.score(
        contributors.map((contributor: Contributor, index) => {
          return {
            ...contributor,
            ...metrics[index],
          };
        }),
      );

      // ensures there is the correct count of normalized contributors
      expect(contributors.length).toEqual(scored.length);

      for (const contributor of scored) {
        // ensure every contributor gets a positive score
        expect(contributor.githubScore).toBeGreaterThanOrEqual(0);
        expect(contributor.onlydustScore).toBeGreaterThanOrEqual(0);
        expect(contributor.globalScore).toBeGreaterThanOrEqual(0);
      }
    });

    it('should compute a unique rank for every contributor', () => {
      faker.seed(42);
      const contributors = ContributorFactory.generateMany(10);
      const metrics = MetricsFactory.generateMany(10);

      const scored = service.score(
        contributors.map((contributor: Contributor, index) => {
          return {
            ...contributor,
            ...metrics[index],
          };
        }),
      );
      const ranks = sortBy(scored.map((contributor) => contributor.globalRank));

      // theoreticalRanks = [1, 2, 3, ..., 9, 10]
      const theoreticalRanks = Array.from(new Array(contributors.length)).map(
        (_, index) => index + 1,
      );
      expect(ranks).toEqual(theoreticalRanks);
    });
  });
});
