import { Module } from '@nestjs/common';
import { ContributorsRepositoryMock } from './contributors.repository.mock';
import { ContributorsService } from './contributors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';
import { SynchronizationTestingModule } from '@/synchronization';
import { MetricsTestingModule } from '@/metrics';
const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

@Module({
  imports: [MetricsTestingModule, SynchronizationTestingModule],
  providers: [
    ContributorsService,
    {
      provide: CONTRIBUTOR_REPOSITORY_TOKEN,
      useClass: ContributorsRepositoryMock,
    },
  ],
  exports: [ContributorsService],
})
export class ContributorsTestingModule {}
