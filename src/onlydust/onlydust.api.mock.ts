import { OnlydustUser } from './types';

export class OnlydustApiMock {
  users: OnlydustUser[] = [
    { id: '1', login: 'username1' },
    { id: '2', login: 'username2' },
    { id: '3', login: 'username3' },
  ];

  /**
   * Gets all users from OnlyDust.
   */
  getUsers(): Promise<OnlydustUser[]> {
    return Promise.resolve(this.users);
  }
}
