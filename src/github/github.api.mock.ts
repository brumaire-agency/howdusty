import { User } from './types';

export class GithubApiMock {
  user: User = {
    id: 'githubusernameid',
    username: 'githubusername',
    name: 'Github User Name',
    avatarUrl: 'https://githubusername.com',
    totalContributions: 2,
  };

  /**
   * Gets contributor info from github.
   */
  getContributorInfo(contributorUsername: string): Promise<User> {
    return Promise.resolve({
      id: this.user.id,
      username: contributorUsername,
      name: this.user.name,
      avatarUrl: this.user.avatarUrl,
      totalContributions: this.user.totalContributions,
    });
  }
}

const openSourceRepository = {
  licenseInfo: {
    key: 'mit',
  },
  isFork: false,
  isPrivate: false,
};

const notOpenSourceRepository1 = {
  licenseInfo: null,
  isFork: false,
  isPrivate: false,
};

const notOpenSourceRepository2 = {
  licenseInfo: {
    key: 'mit',
  },
  isFork: true,
  isPrivate: false,
};

export const graphqlResultMock = {
  userInfo: {
    id: 'githubusernameid',
    login: 'githubusername',
    name: 'Github User Name',
    avatarUrl: 'https://githubusername.com',
  },
  totalContributions: {
    contributionsCollection: {
      repositoryContributions: {
        nodes: [
          { repository: notOpenSourceRepository1 },
          { repository: openSourceRepository },
        ],
      },
      commitContributionsByRepository: [
        {
          contributions: { totalCount: 44 },
          repository: notOpenSourceRepository2,
        },
        {
          contributions: { totalCount: 44 },
          repository: openSourceRepository,
        },
      ],
      issueContributionsByRepository: [
        {
          contributions: { totalCount: 5 },
          repository: openSourceRepository,
        },
      ],
      pullRequestContributionsByRepository: [
        {
          contributions: { totalCount: 6 },
          repository: openSourceRepository,
        },
      ],
    },
  },
};
