import { SynchronizeContributorCommand } from '@/commands/synchronize-contributor.command';
import { GithubApi, GithubApiMock, GithubService } from '@/github';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Contributor,
  ContributorFactory,
  ContributorsRepositoryMock,
  ContributorsService,
} from '@/contributors';
import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { ScorerModule } from '@/scorer';
import { SynchronizationService } from '@/synchronization';
import { faker } from '@faker-js/faker';
import { ScoreContributorsCommand } from './score-contributors.command';

describe('ScoreContributorsCommand', () => {
  let command: SynchronizeContributorCommand;
  let repository: ContributorsRepositoryMock;

  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

  beforeEach(async () => {
    const module: TestingModule = await CommandTestFactory.createTestingCommand(
      {
        imports: [
          ConfigModule.forRoot({
            load: [configuration],
          }),
          ScorerModule,
        ],
        providers: [
          ScoreContributorsCommand,
          SynchronizationService,
          ContributorsService,
          {
            provide: CONTRIBUTOR_REPOSITORY_TOKEN,
            useClass: ContributorsRepositoryMock,
          },
          GithubService,
          {
            provide: GithubApi,
            useClass: GithubApiMock,
          },
        ],
      },
    ).compile();

    command = module.get(ScoreContributorsCommand);
    repository = module.get(CONTRIBUTOR_REPOSITORY_TOKEN);
  });

  it('should score every contributors', async () => {
    faker.seed(42);
    await repository.save(ContributorFactory.generateMany(5));
    await command.run([]);

    expect(repository.contributors.length).toEqual(5);

    for (const contributor of repository.contributors) {
      expect(contributor.score).toBeDefined();
    }
  });
});
