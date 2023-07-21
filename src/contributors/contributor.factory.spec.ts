import { ContributorFactory } from './contributor.factory';
import { MetricName } from '@/metrics';
import { faker } from '@faker-js/faker';

describe('ContributorFactory', () => {
  describe('generate', () => {
    it('should generate a random contributor with preset', () => {
      const contributor = ContributorFactory.generate({
        username: 'denvercoder9',
      });

      expect(contributor.username).toEqual('denvercoder9');
      expect(contributor.id).toBeDefined();
      expect(contributor.name).toBeDefined();
      expect(contributor.avatarUrl).toBeDefined();

      for (const metric in MetricName) {
        expect(contributor[metric]).toBeDefined();
      }
    });

    it('should generate predictable values through faker', () => {
      faker.seed(42);
      const contributor = ContributorFactory.generate();

      expect(contributor).toEqual({
        id: '5cf2bc99-2721-407d-8592-ba00fbdf302f',
        avatarUrl: 'https://avatars.githubusercontent.com/u/39986098',
        username: 'Lia.Moore',
        name: 'Nancy Leffler',
        totalContributions: 139,
        contributedRepositoryCount: 0,
        maintainedRepositoryCount: 3,
        issuePullRequestRatio: 0.97,
        activeContributionWeeks: 4,
        collectedGrant: 1164,
        missionCount: 9,
      });
    });
  });

  describe('generateMany', () => {
    it('should generate the correct amount of contributors', () => {
      const contributors = ContributorFactory.generateMany(10);
      expect(contributors.length).toEqual(10);
    });
  });
});
