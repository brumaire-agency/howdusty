import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { GithubApi } from '../github/github.api';
import { GithubApiMock } from '../github/github.api.mock';
import { ContributorsService } from '../contributors/contributors.service';
import { ContributorsRepositoryMock } from '../contributors/contributors.repository.mock';
import { Contributor } from '../contributors/entity/contributor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { SynchronizeContributorCommand } from './synchronize-contributor.command';
import { SynchronizationService } from '../synchronization/synchronization.service';
import { GithubService } from '../github/github.service';

describe('SynchronizeContributorCommand', () => {
  let synchronizationContributorCommand: SynchronizeContributorCommand;
  let githubApi: GithubApiMock;

  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

  beforeEach(async () => {
    const command: TestingModule =
      await CommandTestFactory.createTestingCommand({
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
      }).compile();

    synchronizationContributorCommand =
      command.get<SynchronizeContributorCommand>(SynchronizeContributorCommand);
    githubApi = command.get<GithubApiMock>(GithubApi);
  });

  it('should synchronize a user', async () => {
    const logSpy = jest.spyOn(global.console, 'log');
    await synchronizationContributorCommand.run([githubApi.user.username]);
    expect(logSpy).toHaveBeenCalledWith(
      `The user ${githubApi.user.username} has been synchronized`,
    );
    logSpy.mockRestore();
  });
});
