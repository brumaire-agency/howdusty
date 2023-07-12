import { Module } from '@nestjs/common';
import { ContributorsRepositoryMock } from './contributors.repository.mock';
import { ContributorsService } from './contributors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';

const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

@Module({
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
