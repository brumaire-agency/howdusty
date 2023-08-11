import { ContributorDto } from './contributor.dto';
import { faker } from '@faker-js/faker';
import { ContributorInfo, ContributorModel } from './types';
import { Contributor } from './contributor.entity';

export class ContributorFactory {
  /**
   * Generates a contributor from a preset.
   */
  public static generate(preset: Partial<Contributor> = {}): Contributor {
    return Object.assign(this.generateContributorInfo(), preset);
  }

  /**
   * Generates a set of contributors of the given length.
   */
  public static generateMany(
    count: number,
    preset: Partial<ContributorDto> = {},
  ): Contributor[] {
    return Array.from(new Array(count)).map(() =>
      ContributorFactory.generate(preset),
    );
  }

  public static generateContributorInfo(
    preset: Partial<ContributorDto> = {},
  ): Contributor {
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

  public static generateManyContributorInfo(
    count: number,
    preset: Partial<ContributorDto> = {},
  ): ContributorInfo[] {
    return Array.from(new Array(count)).map(() =>
      ContributorFactory.generateContributorInfo(preset),
    );
  }
}
