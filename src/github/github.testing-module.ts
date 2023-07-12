import { Module } from '@nestjs/common';
import { GithubApi } from './github.api';
import { GithubApiMock } from './github.api.mock';
import { GithubService } from './github.service';

@Module({
  providers: [
    {
      provide: GithubApi,
      useClass: GithubApiMock,
    },
    GithubService,
  ],
  exports: [GithubService],
})
export class GithubTestingModule {}
