import { OnlydustUser } from './types';

export class OnlydustApiMock {
  users: OnlydustUser[] = [
    { id: '1', login: 'username1' },
    { id: '2', login: 'username2' },
    { id: '3', login: 'username3' },
  ];

  collectedGrants = {
    collectedGrant: {
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
   * Gets collectedGrant for all users from OnlyDust.
   */
  getCollectedGrants(
    usernames: string[],
  ): Promise<Record<string, Record<string, number>>> {
    return Promise.resolve({
      collectedGrant: usernames.reduce(
        (record, username) => ({
          ...record,
          [username]: 100,
        }),
        {},
      ),
    });
  }
}
