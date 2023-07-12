import { Module } from '@nestjs/common';
import { GithubModule } from '@/github';
import { MetricsService } from './metrics.service';
import { OnlydustService } from '@/onlydust';

@Module({
  imports: [GithubModule, OnlydustService],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
