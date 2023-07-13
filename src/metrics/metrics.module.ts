import { Module } from '@nestjs/common';
import { GithubModule } from '@/github';
import { MetricsService } from './metrics.service';
import { OnlydustModule } from '@/onlydust';

@Module({
  imports: [GithubModule, OnlydustModule],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
