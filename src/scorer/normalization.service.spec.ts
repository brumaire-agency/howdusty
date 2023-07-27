import { NormalizationService } from '@/scorer/normalization.service';
import { Test } from '@nestjs/testing';
import { StandardScaler } from '@/scorer/standard-scaler.service';
import { Contributor, ContributorFactory } from '@/contributors';
import { MetricName } from '@/metrics';

describe('NormalizationService', () => {
  /**
   * The normalization service.
   */
  let service: NormalizationService;

  /**
   * Creates a new normalization service before each test.
   */
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StandardScaler, NormalizationService],
    }).compile();

    service = module.get(NormalizationService);
  });

  describe('normalize', () => {
    it('should normalize a set of contributors', async () => {
      const contributors = ContributorFactory.generateMany(10);

      const normalizedContributors = service.normalize(
        contributors.map((contributor: Contributor) => {
          const { metric, ...rest } = contributor;
          return {
            ...metric,
            ...rest,
          };
        }),
        Object.values(MetricName) as MetricName[],
      );

      // ensures there is the correct count of normalized contributors
      expect(contributors.length).toEqual(normalizedContributors.length);

      // ensure every feature has been scaled between 0 and 1
      for (const contributor of normalizedContributors) {
        for (const key in contributor) {
          expect(typeof contributor[key]).toBe('number');
          expect(contributor[key]).toBeGreaterThanOrEqual(0);
          expect(contributor[key]).toBeLessThanOrEqual(1);
        }
      }
    });
  });
});
