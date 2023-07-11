import { Module } from '@nestjs/common';
import { GithubModule } from '@/github';
import { MetricsService } from './metrics.service';

@Module({
  imports: [GithubModule],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
