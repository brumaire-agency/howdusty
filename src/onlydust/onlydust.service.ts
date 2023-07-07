import { Injectable } from '@nestjs/common';
import { OnlydustApi } from './onlydust.api';

@Injectable()
export class OnlydustService {
  constructor(private api: OnlydustApi) {}

  async getUsers() {
    return await this.api.getUsers();
  }

  async getContributorsInfo(usernames: string[]) {
    return await this.api.getContributorsInfo(usernames);
  }
}
