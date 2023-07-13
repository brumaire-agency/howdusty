import { Module } from '@nestjs/common';
import { GithubTestingModule } from '@/github';
import { MetricsService } from './metrics.service';
import { OnlydustTestingModule } from '@/onlydust';

@Module({
  imports: [GithubTestingModule, OnlydustTestingModule],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsTestingModule {}
