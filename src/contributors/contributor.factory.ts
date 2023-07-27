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

  // public static generateMetrics(
  //   preset: Partial<ContributorDto> = {},
  // ): ContributorMetrics {
  //   return Object.assign(
  //     {
  //       totalContributions: faker.number.int(1000),
  //       contributedRepositoryCount: faker.number.int(10),
  //       maintainedRepositoryCount: faker.number.int(10),
  //       issuePullRequestRatio: faker.number.float({
  //         min: 0.01,
  //         max: 0.99,
  //         precision: 0.01,
  //       }),
  //       activeContributionWeeks: faker.number.int(10),
  //       collectedGrant: faker.number.int(5000),
  //       meanGrantPerProject: faker.number.int(500),
  //       contributedProjectCount: faker.number.int(10),
  //       missionCount: faker.number.int(20),
  //     },
  //     preset,
  //   );
  // }

  // public static genrerateContributorMetrics(
  //   preset: Partial<ContributorDto> = {},
  // ) {
  //   return Object.assign(
  //     {
  //       id: faker.string.uuid(),
  //       ...this.generateMetrics(),
  //     },
  //     preset,
  //   );
  // }

  // public static generateManyContributorMetrics(
  //   count: number,
  //   preset: Partial<ContributorDto> = {},
  // ): any[] {
  //   return Array.from(new Array(count)).map(() =>
  //     ContributorFactory.genrerateContributorMetrics(preset),
  //   );
  // }
}
