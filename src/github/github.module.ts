import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubApi } from './github.api';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ConfigService, GithubService, GithubApi],
  exports: [GithubApi],
})
export class GithubModule {}
