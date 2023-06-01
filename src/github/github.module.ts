import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubApi } from './github.api';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [GithubService, GithubApi],
  exports: [GithubApi],
})
export class GithubModule {}
