import { Contributor } from './contributor.entity';
import { faker } from '@faker-js/faker';

export class ContributorFactory {
  /**
   * Generates a contributor from a preset.
   */
  public static generate(preset: Partial<Contributor> = {}): Contributor {
    return Object.assign(
      {
        id: faker.string.uuid(),
        username: faker.internet.userName(),
        name: faker.person.fullName(),
        avatarUrl: faker.image.avatarGitHub(),
        totalContributions: faker.number.int(1000),
        contributedRepositoryCount: faker.number.int(10),
        maintainedRepositoryCount: faker.number.int(10),
        issuePullRequestRatio: faker.number.float({
          min: 0.01,
          max: 0.99,
          precision: 0.01,
        }),
        activeContributionWeeks: faker.number.int(10),
        collectedGrant: faker.number.int(5000),
      },
      preset,
    );
  }

  /**
   * Generates a set of contributors of the given length.
   */
  public static generateMany(
    count: number,
    preset: Partial<Contributor> = {},
  ): Contributor[] {
    return Array.from(new Array(count)).map(() =>
      ContributorFactory.generate(preset),
    );
  }
}
