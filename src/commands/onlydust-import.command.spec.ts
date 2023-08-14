import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import { ContributorsTestingModule } from '@/contributors';
import {
  OnlydustApi,
  OnlydustApiMock,
  OnlydustTestingModule,
} from '@/onlydust';
import { SynchronizationTestingModule } from '@/synchronization';
import { OnlydustImportCommand } from './onlydust-import.command';
import { Logger } from '@nestjs/common';

describe('OnlydustImportCommand', () => {
  let command: OnlydustImportCommand;
  let onlydustApi: OnlydustApiMock;

  beforeEach(async () => {
    const module: TestingModule = await CommandTestFactory.createTestingCommand(
      {
        imports: [
          ContributorsTestingModule,
          OnlydustTestingModule,
          SynchronizationTestingModule,
        ],
        providers: [OnlydustImportCommand],
      },
    ).compile();

    command = module.get(OnlydustImportCommand);
    onlydustApi = module.get(OnlydustApi);
  });

  it('should get onlydust users and synchronizes them', async () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log');
    await command.run();
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      `synchronizing ${onlydustApi.users[0].login}, 1/${onlydustApi.users.length}`,
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      `synchronizing ${onlydustApi.users[1].login}, 2/${onlydustApi.users.length}`,
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      3,
      `synchronizing ${onlydustApi.users[2].login}, 3/${onlydustApi.users.length}`,
    );
    logSpy.mockRestore();
  });
});
