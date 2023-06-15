import { Contributor } from './contributor.entity';
import { faker } from '@faker-js/faker';

export class ContributorFactory {
  /**
   * Generates a contributor from a preset.
   */
  public static generate(preset: Partial<Contributor> = {}): Contributor {
    return Object.assign(
      {
        id: faker.string.numeric(),
        username: faker.internet.userName(),
        name: faker.person.fullName(),
        avatarUrl: faker.image.avatarGitHub(),
        totalContributions: faker.number.int(1000),
        contributedRepositoryCount: faker.number.int(10),
        maintainedRepositoryCount: faker.number.int(10),
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
