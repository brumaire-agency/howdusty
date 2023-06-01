import { User } from './types';

export class GithubApiMock {
  /**
   * Gets contributor info from github.
   */
  getContributorInfo(contributorUsername: string): Promise<User> {
    return Promise.resolve({
      username: contributorUsername,
      name: 'User Name',
      avatarUrl: 'https://username.com',
    });
  }
}
