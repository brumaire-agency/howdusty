import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommandTestFactory } from 'nest-commander-testing';
import configuration from '@/config/configuration';
import { GithubApiMock, GithubApi, GithubService } from '@/github';
import { ScorerModule } from '@/scorer';
import {
  Contributor,
  ContributorsService,
  ContributorsRepositoryMock,
} from '@/contributors';
import { OnlydustApi, OnlydustApiMock, OnlydustService } from '@/onlydust';
import { SynchronizationService } from '@/synchronization';
import { OnlydustImportCommand } from './onlydust-import.command';

describe('OnlydustImportCommand', () => {
  let command: OnlydustImportCommand;
  let onlydustApi: OnlydustApiMock;

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
          OnlydustImportCommand,
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
          OnlydustService,
          {
            provide: OnlydustApi,
            useClass: OnlydustApiMock,
          },
        ],
      },
    ).compile();

    command = module.get(OnlydustImportCommand);
    onlydustApi = module.get<OnlydustApiMock>(OnlydustApi);
  });

  it('should get onlydust users and synchronizes them', async () => {
    const logSpy = jest.spyOn(global.console, 'log');
    await command.run();
    expect(logSpy).toHaveBeenCalledWith(
      `${onlydustApi.users.length} users have been imported and synchronized`,
    );
    logSpy.mockRestore();
  });
});
