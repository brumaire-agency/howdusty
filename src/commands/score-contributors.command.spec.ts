import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Contributor,
  ContributorFactory,
  ContributorsRepositoryMock,
} from '@/contributors';
import { TestingModule } from '@nestjs/testing';
import { CommandTestFactory } from 'nest-commander-testing';
import {
  SynchronizationService,
  SynchronizationTestingModule,
} from '@/synchronization';
import { faker } from '@faker-js/faker';
import { ScoreContributorsCommand } from './score-contributors.command';

describe('ScoreContributorsCommand', () => {
  let command: ScoreContributorsCommand;
  let repository: ContributorsRepositoryMock;
  let synchronization: SynchronizationService;

  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

  beforeEach(async () => {
    const module: TestingModule = await CommandTestFactory.createTestingCommand(
      {
        imports: [SynchronizationTestingModule],
        providers: [ScoreContributorsCommand],
      },
    ).compile();

    command = module.get(ScoreContributorsCommand);
    repository = module.get(CONTRIBUTOR_REPOSITORY_TOKEN);
    synchronization = module.get(SynchronizationService);
  });

  it('should score every contributors', async () => {
    faker.seed(42);
    await repository.save(ContributorFactory.generateManyUserInfo(5));
    await synchronization.synchronizeUsersMetrics();
    await command.run();

    expect(repository.contributors.length).toEqual(5);

    for (const contributor of repository.contributors) {
      expect(contributor.score).toBeDefined();
    }
  });
});
