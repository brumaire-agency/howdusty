import { GithubGraphResponse, Metric, MetricData } from './base.metric';

export class ActiveContributionWeeksMetric extends Metric<
  ActiveContributionWeeksResult,
  ActiveContributionWeeksData
> {
  buildQuery(username: string): string {
    return `
      activeContributionWeeks: user(login: "${username}") {
        contributionsCollection {
          repositoryContributions(first: 100) {
            nodes {
              repository {
                occurredAt
                licenseInfo {
                  key
                }
                isFork
                isPrivate
              }
            }
          }
          commitContributionsByRepository {
            contributions(first: 100) {
              nodes {
                occurredAt
              }
            }
            repository {
              licenseInfo {
                key
              }
              isFork
              isPrivate
            }
          }
          issueContributionsByRepository {
            contributions(first: 100) {
              nodes {
                occurredAt
              }
            }
            repository {
              licenseInfo {
                key
              }
              isFork
              isPrivate
            }
          }
          pullRequestContributionsByRepository {
            contributions(first: 100) {
              nodes {
                occurredAt
              }
            }
            repository {
              licenseInfo {
                key
              }
              isFork
              isPrivate
            }
          }
        }
      }
    `;
  }

  parseResult(
    result: ActiveContributionWeeksResult,
  ): ActiveContributionWeeksData {
    // Repositories
    const repositoriesContributions: CreatedRepositoryContribution[] =
      this.createdOpenSourceRepositories(
        result.activeContributionWeeks.contributionsCollection
          .repositoryContributions.nodes,
      );
    const repositoryWeeks = this.getWeeksOfContributionsCreatedRepositories(
      repositoriesContributions,
    );

    // Commit
    const commitContributions: ContributionsByRepository[] =
      this.contributionsFromOpenSourceRepositories(
        result.activeContributionWeeks.contributionsCollection
          .commitContributionsByRepository,
      );
    const commitWeeks = this.getWeeksOfContributions(commitContributions);

    // Issue
    const issueContributions: ContributionsByRepository[] =
      this.contributionsFromOpenSourceRepositories(
        result.activeContributionWeeks.contributionsCollection
          .issueContributionsByRepository,
      );
    const issueWeeks = this.getWeeksOfContributions(issueContributions);

    // Pull Request
    const pullRequestContributions: ContributionsByRepository[] =
      this.contributionsFromOpenSourceRepositories(
        result.activeContributionWeeks.contributionsCollection
          .pullRequestContributionsByRepository,
      );
    const pullRequestWeeks = this.getWeeksOfContributions(
      pullRequestContributions,
    );

    const allWeeks = this.removeDuplicateWeeks([
      ...repositoryWeeks,
      ...commitWeeks,
      ...issueWeeks,
      ...pullRequestWeeks,
    ]);

    return {
      activeContributionWeeks: allWeeks.length,
    };
  }

  /**
   * Return the year and the week number of a string date.
   */
  getWeekObject(date: string): WeekObject {
    // Get the current date and his year
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    // Get the first day of the current year
    const firstDayOfYear = new Date(year, 0, 1);
    //  Calculate the difference between the two dates in days
    const days = Math.floor(
      (currentDate.getTime() - firstDayOfYear.getTime()) /
        (24 * 60 * 60 * 1000),
    );
    // Get the week number
    const weekNumber = Math.ceil(days / 7);

    return {
      year: year,
      weekNumber: weekNumber,
    };
  }

  /**
   * Collect all occurredAt and convert to week object
   */
  getWeeksOfContributions(
    contributionsByRepositories: ContributionsByRepository[],
  ): WeekObject[] {
    const weeks: WeekObject[] = [];
    for (const contributionsByRepository of contributionsByRepositories) {
      for (const contribution of contributionsByRepository.contributions
        .nodes) {
        weeks.push(this.getWeekObject(contribution.occurredAt));
      }
    }
    return weeks;
  }

  /**
   * Collect all occurredAt and convert to week object
   */
  getWeeksOfContributionsCreatedRepositories(
    createdRepositories: CreatedRepositoryContribution[],
  ): WeekObject[] {
    const weeks: WeekObject[] = [];
    for (const repository of createdRepositories) {
      weeks.push(this.getWeekObject(repository.occurredAt));
    }
    return weeks;
  }

  /**
   * Remove all duplicate weeks.
   */
  removeDuplicateWeeks(weeks: WeekObject[]): WeekObject[] {
    return weeks.filter(
      (week, index) =>
        weeks.findIndex(
          (item) =>
            item.weekNumber === week.weekNumber && item.year === week.year,
        ) === index,
    );
  }

  /**
   * Return contributions from open source repositories.
   */
  contributionsFromOpenSourceRepositories(
    contributionsByRepository: ContributionsByRepository[],
  ): ContributionsByRepository[] {
    const openSourceLicenses = ['mit', 'apache-2.0', 'gpl-3.0', 'agpl-3.0'];
    return contributionsByRepository.filter(
      (contributionByRepository) =>
        !contributionByRepository.repository.isFork &&
        !contributionByRepository.repository.isPrivate &&
        openSourceLicenses.includes(
          contributionByRepository.repository.licenseInfo?.key,
        ),
    );
  }

  /**
   * Return created open source repositories.
   */
  createdOpenSourceRepositories(
    createdRepositories: CreatedRepositoryContribution[],
  ): CreatedRepositoryContribution[] {
    const openSourceLicenses = ['mit', 'apache-2.0', 'gpl-3.0', 'agpl-3.0'];
    return createdRepositories.filter(
      (createdRepository) =>
        !createdRepository.repository.isFork &&
        !createdRepository.repository.isPrivate &&
        openSourceLicenses.includes(
          createdRepository.repository.licenseInfo?.key,
        ),
    );
  }
}

/**
 * Represents the object returned by the github graphql api.
 */
export interface ActiveContributionWeeksResult extends GithubGraphResponse {
  activeContributionWeeks: {
    contributionsCollection: {
      repositoryContributions: {
        nodes: CreatedRepositoryContribution[];
      };
      commitContributionsByRepository: ContributionsByRepository[];
      issueContributionsByRepository: ContributionsByRepository[];
      pullRequestContributionsByRepository: ContributionsByRepository[];
    };
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface ActiveContributionWeeksData extends MetricData {
  activeContributionWeeks: number;
}

interface CreatedRepositoryContribution {
  occurredAt: string;
  repository: RepositoryQuery;
}

interface ContributionsByRepository {
  contributions: {
    nodes: { occurredAt: string }[];
  };
  repository: RepositoryQuery;
}

interface RepositoryQuery {
  licenseInfo?: LicenseQuery;
  isFork: boolean;
  isPrivate: boolean;
}

interface LicenseQuery {
  key: string;
}

interface WeekObject {
  year: number;
  weekNumber: number;
}
