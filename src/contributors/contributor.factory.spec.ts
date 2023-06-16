import { ContributorFactory } from './contributor.factory';
import { MetricName } from '@/github/metrics';
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
        id: '3',
        avatarUrl: 'https://avatars.githubusercontent.com/u/45924889',
        username: 'Peyton_Deckow-Reynolds59',
        name: 'Melinda Bradtke',
        totalContributions: 867,
        contributedRepositoryCount: 3,
        maintainedRepositoryCount: 6,
        issuePullRequestRatio: 0.15,
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
