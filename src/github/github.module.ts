import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubApi } from './github.api';
import { GithubService } from './github.service';

@Module({
  imports: [ConfigModule],
  providers: [GithubService, GithubApi],
  exports: [GithubService, GithubApi],
})
export class GithubModule {}
