import { Module } from '@nestjs/common';
import { SynchronizationService } from './synchronization.service';
import { GithubModule } from '../github/github.module';
import { ContributorsModule } from '../contributors/contributors.module';

@Module({
  imports: [ContributorsModule, GithubModule],
  providers: [SynchronizationService],
  exports: [SynchronizationService],
})
export class SynchronizationModule {}
