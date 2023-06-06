import { Injectable } from '@nestjs/common';
import { GithubApi } from './github.api';

@Injectable()
export class GithubService {
  constructor(private api: GithubApi) {}

  async getContributorInfo(contributorUsername: string) {
    return await this.api.getContributorInfo(contributorUsername);
  }
}
