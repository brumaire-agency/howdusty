import { Module } from '@nestjs/common';
import { ContributorsModule } from '@/contributors';
import { MetricsModule } from '@/metrics';
import { ScorerModule } from '@/scorer';
import { SynchronizationService } from './synchronization.service';
import { GithubModule } from '@/github';

@Module({
  imports: [ContributorsModule, GithubModule, MetricsModule, ScorerModule],
  providers: [SynchronizationService],
  exports: [SynchronizationService],
})
export class SynchronizationModule {}
