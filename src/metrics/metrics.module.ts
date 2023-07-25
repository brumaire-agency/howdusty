import { Module } from '@nestjs/common';
import { GithubModule } from '@/github';
import { MetricsService } from './metrics.service';
import { OnlydustModule } from '@/onlydust';
import { Metrics } from './metrics.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Metrics]), GithubModule, OnlydustModule],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
