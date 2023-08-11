import { OnlydustUser } from './types';

export class OnlydustApiMock {
  users: OnlydustUser[] = [
    { id: '1', login: 'username1' },
    { id: '2', login: 'username2' },
    { id: '3', login: 'username3' },
  ];

  onlydustCollectedGrants = {
    onlydustCollectedGrant: {
      username1: 100,
      username2: 300,
      username3: 500,
    },
  };

  /**
   * Gets all users from OnlyDust.
   */
  getUsers(): Promise<OnlydustUser[]> {
    return Promise.resolve(this.users);
  }

  /**
   * Gets onlydustCollectedGrant for all users from OnlyDust.
   */
  getonlydustCollectedGrants(
    usernames: string[],
  ): Promise<Record<string, Record<string, number>>> {
    return Promise.resolve({
      onlydustCollectedGrant: usernames.reduce(
        (record, username) => ({
          ...record,
          [username]: 100,
        }),
        {},
      ),
    });
  }

  /**
   * Gets onlydustMeanGrantPerProject for all users from OnlyDust.
   */
  getonlydustMeanGrantPerProject(
    usernames: string[],
  ): Promise<Record<string, Record<string, number>>> {
    return Promise.resolve({
      onlydustMeanGrantPerProject: usernames.reduce(
        (record, username) => ({
          ...record,
          [username]: 10,
        }),
        {},
      ),
    });
  }

  /**
   * Gets the number of unique projects each contributor has contributed to.
   */
  getonlydustContributedProjectCount(
    usernames: string[],
  ): Promise<Record<string, Record<string, number>>> {
    return Promise.resolve({
      onlydustContributedProjectCount: usernames.reduce(
        (record, username) => ({
          ...record,
          [username]: 5,
        }),
        {},
      ),
    });
  }

  /**
   * Gets the number of missions each contributor.
   */
  getonlydustContributionCount(
    usernames: string[],
  ): Promise<Record<string, Record<string, number>>> {
    return Promise.resolve({
      onlydustContributionCount: usernames.reduce(
        (record, username) => ({
          ...record,
          [username]: 20,
        }),
        {},
      ),
    });
  }
}
