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
