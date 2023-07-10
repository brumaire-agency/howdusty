import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { GithubModule } from '@/github';

@Module({
  imports: [GithubModule],
  providers: [MetricsService],
})
export class MetricsModule {}
