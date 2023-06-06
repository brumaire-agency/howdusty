import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommandTestFactory } from 'nest-commander-testing';
import configuration from '@/config/configuration';
import { GithubApiMock, GithubApi, GithubService } from '@/github';
import {
  Contributor,
  ContributorsService,
  ContributorsRepositoryMock,
} from '@/contributors';
import { SynchronizationService } from '@/synchronization';
import { SynchronizeContributorCommand } from '@/commands/synchronize-contributor.command';

describe('SynchronizeContributorCommand', () => {
  let command: SynchronizeContributorCommand;
  let githubApi: GithubApiMock;

  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

  beforeEach(async () => {
    const module: TestingModule = await CommandTestFactory.createTestingCommand(
      {
        imports: [
          ConfigModule.forRoot({
            load: [configuration],
          }),
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

    command = module.get<SynchronizeContributorCommand>(
      SynchronizeContributorCommand,
    );
    githubApi = module.get<GithubApiMock>(GithubApi);
  });

  it('should synchronize a user', async () => {
    const logSpy = jest.spyOn(global.console, 'log');
    await command.run([githubApi.user.username]);
    expect(logSpy).toHaveBeenCalledWith(
      `The user ${githubApi.user.username} has been synchronized`,
    );
    logSpy.mockRestore();
  });
});
