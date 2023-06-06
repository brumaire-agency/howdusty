import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubApi } from '@/github/github.api';
import { GithubService } from '@/github/github.service';

@Module({
  imports: [ConfigModule],
  providers: [GithubService, GithubApi],
  exports: [GithubApi, GithubService],
})
export class GithubModule {}
