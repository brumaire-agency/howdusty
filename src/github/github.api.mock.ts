import { faker } from '@faker-js/faker';
import { User } from './types';
import { ContributorFactory } from '@/contributors';

export class GithubApiMock {
  /**
   * Gets contributor info from github.
   */
  getContributorInfo(contributorUsername: string): Promise<User> {
    faker.seed(42);
    return Promise.resolve(
      ContributorFactory.generate({
        username: contributorUsername,
      }),
    );
  }
}
