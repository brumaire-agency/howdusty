import { Test, TestingModule } from '@nestjs/testing';
import { SynchronizationService } from './synchronization.service';
import { GithubModule } from '../github/github.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { ContributorsModule } from '../contributors/contributors.module';
import { ContributorsService } from '../contributors/contributors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contributor } from '../contributors/entity/contributor.entity';

describe('SynchronizationService', () => {
  let synchronization: SynchronizationService;
  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

  const mockProductRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        GithubModule,
      ],
      providers: [
        SynchronizationService,
        ContributorsService,
        {
          provide: CONTRIBUTOR_REPOSITORY_TOKEN,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    synchronization = module.get<SynchronizationService>(
      SynchronizationService,
    );
  });

  describe('githubUser', () => {
    it('should return a Contributor', () => {
      // synchronization.githubUser('zoemeriet');
    });
  });
});
