import { User } from './interfaces/user.interface';

export class GithubApiMock {
  /**
   * Gets contributor info from github.
   */
  async getContributorInfo(contributorUsername: string): Promise<User> {
    return {
      username: contributorUsername,
      name: 'User Name',
      avatarUrl: 'https://username.com',
    };
  }
}
