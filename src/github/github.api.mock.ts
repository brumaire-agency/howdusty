import { faker } from '@faker-js/faker';
import { ContributorFactory } from '@/contributors';
import { GithubQuery } from './queries';

export class GithubApiMock {
  /**
   * Gets info from github.
   */
  getInfo(username: string, queries: GithubQuery[]) {
    faker.seed(42);
    return Promise.resolve(
      ContributorFactory.generate({
        username: username,
      }),
    );
  }
}
