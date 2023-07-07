import { Module } from '@nestjs/common';
import { ContributorsModule } from '@/contributors';
import { GithubModule } from '@/github';
import { OnlydustModule } from '@/onlydust';
import { ScorerModule } from '@/scorer';
import { SynchronizationService } from './synchronization.service';

@Module({
  imports: [ContributorsModule, GithubModule, OnlydustModule, ScorerModule],
  providers: [SynchronizationService],
  exports: [SynchronizationService],
})
export class SynchronizationModule {}
