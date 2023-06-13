import { Contributor } from './contributor.entity';

export class ContributorFactory {
  /**
   * Generates a contributor from a preset.
   */
  public static generate(preset: Partial<Contributor> = {}): Contributor {
    return Object.assign(
      {
        id: 'denvercoder9',
        username: 'denvercoder9',
        name: 'Denver Coder',
        avatarUrl: 'https://imgs.xkcd.com/comics/wisdom_of_the_ancients.png',
        totalContributions: 0,
        contributedRepositoryCount: 0,
      },
      preset,
    );
  }

  /**
   * Generates a set of contributors of the given length.
   */
  public static generateMany(count: number): Contributor[] {
    return Array.from(new Array(count)).map((_, index) =>
      ContributorFactory.generate({
        totalContributions: index,
        contributedRepositoryCount: index,
      }),
    );
  }
}
