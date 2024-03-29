import { Module, forwardRef } from '@nestjs/common';
import { SynchronizationService } from './synchronization.service';
import { ContributorsTestingModule } from '@/contributors';
import { GithubTestingModule } from '@/github';
import { MetricsTestingModule } from '@/metrics';
import { ScorerModule } from '@/scorer';

@Module({
  imports: [
    forwardRef(() => ContributorsTestingModule),
    GithubTestingModule,
    MetricsTestingModule,
    ScorerModule,
  ],
  providers: [SynchronizationService],
  exports: [SynchronizationService],
})
export class SynchronizationTestingModule {}
