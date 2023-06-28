import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommandTestFactory } from 'nest-commander-testing';
import { faker } from '@faker-js/faker';
import configuration from '@/config/configuration';
import { GithubApiMock, GithubApi, GithubService } from '@/github';
import { ScorerModule } from '@/scorer';
import {
  Contributor,
  ContributorsService,
  ContributorsRepositoryMock,
  ContributorFactory,
} from '@/contributors';
import { SynchronizationService } from '@/synchronization';
import { SynchronizeContributorCommand } from './synchronize-contributor.command';

describe('SynchronizeContributorCommand', () => {
  let command: SynchronizeContributorCommand;
  let contributorsRepository: ContributorsRepositoryMock;
  let githubApi: GithubApiMock;

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
          SynchronizeContributorCommand,
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

    command = module.get(SynchronizeContributorCommand);
    contributorsRepository = module.get(CONTRIBUTOR_REPOSITORY_TOKEN);
    githubApi = module.get(GithubApi);
  });

  it('should synchronize a user', async () => {
    const logSpy = jest.spyOn(global.console, 'log');
    await command.run([githubApi.user.username]);
    expect(logSpy).toHaveBeenCalledWith([
      { syncronized: true, username: githubApi.user.username },
    ]);
    logSpy.mockRestore();
  });

  it('should synchronize all users from database', async () => {
    faker.seed(42);
    await contributorsRepository.save(ContributorFactory.generateMany(3));
    const logSpy = jest.spyOn(global.console, 'log');
    await command.run();
    expect(logSpy).toHaveBeenCalledWith([
      {
        syncronized: true,
        username: contributorsRepository.contributors[0].username,
      },
      {
        syncronized: true,
        username: contributorsRepository.contributors[1].username,
      },
      {
        syncronized: true,
        username: contributorsRepository.contributors[2].username,
      },
    ]);
    logSpy.mockRestore();
  });
});
