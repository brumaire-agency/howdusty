import { Module } from '@nestjs/common';
import { GithubTestingModule } from '@/github';
import { MetricsService } from './metrics.service';
import { OnlydustTestingModule } from '@/onlydust';
import { MetricsRepositoryMock } from './metrics.repository.mocks';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Metrics } from './metrics.entity';

const METRICS_REPOSITORY_TOKEN = getRepositoryToken(Metrics);

@Module({
  imports: [GithubTestingModule, OnlydustTestingModule],
  providers: [
    MetricsService,
    {
      provide: METRICS_REPOSITORY_TOKEN,
      useClass: MetricsRepositoryMock,
    },
  ],
  exports: [MetricsService],
})
export class MetricsTestingModule {}
