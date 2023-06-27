import { OnlydustUser } from './types';

export class OnlydustApiMock {
  users: OnlydustUser[] = [{ id: '1' }, { id: '2' }, { id: '3' }];

  /**
   * Gets all users from OnlyDust.
   */
  getUsers(): Promise<OnlydustUser[]> {
    return Promise.resolve(this.users);
  }
}
