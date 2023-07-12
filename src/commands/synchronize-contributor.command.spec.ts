import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommandTestFactory } from 'nest-commander-testing';
import { faker } from '@faker-js/faker';
import {
  Contributor,
  ContributorsRepositoryMock,
  ContributorFactory,
} from '@/contributors';
import { SynchronizationTestingModule } from '@/synchronization';
import { SynchronizeContributorCommand } from './synchronize-contributor.command';

describe('SynchronizeContributorCommand', () => {
  let command: SynchronizeContributorCommand;
  let contributorsRepository: ContributorsRepositoryMock;

  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

  beforeEach(async () => {
    const module: TestingModule = await CommandTestFactory.createTestingCommand(
      {
        imports: [SynchronizationTestingModule],
        providers: [SynchronizeContributorCommand],
      },
    ).compile();

    command = module.get(SynchronizeContributorCommand);
    contributorsRepository = module.get(CONTRIBUTOR_REPOSITORY_TOKEN);
  });

  it('should synchronize a user', async () => {
    const logSpy = jest.spyOn(global.console, 'log');
    await command.run(['username']);
    expect(logSpy).toHaveBeenCalledWith('1 users have been synchronized');
    logSpy.mockRestore();
  });

  it('should synchronize all users from database', async () => {
    faker.seed(42);
    await contributorsRepository.save(ContributorFactory.generateMany(3));
    const logSpy = jest.spyOn(global.console, 'log');
    await command.run();
    expect(logSpy).toHaveBeenCalledWith(
      `${contributorsRepository.contributors.length} users have been synchronized`,
    );
    logSpy.mockRestore();
  });
});
