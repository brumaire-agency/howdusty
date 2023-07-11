import { Module } from '@nestjs/common';
import { GithubTestingModule } from '@/github';
import { MetricsService } from './metrics.service';

@Module({
  imports: [GithubTestingModule],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsTestingModule {}
g;
