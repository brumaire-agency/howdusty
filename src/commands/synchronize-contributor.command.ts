import { Command, CommandRunner } from 'nest-commander';
import { SynchronizationService } from '@/synchronization';
import { Logger } from '@nestjs/common';

/**
 * Synchronize contributors with the github API.
 */
@Command({
  name: 'contributors:sync',
})
export class SynchronizeContributorCommand extends CommandRunner {
  private readonly logger = new Logger(SynchronizeContributorCommand.name);

  constructor(private synchronization: SynchronizationService) {
    super();
  }

  async run(usernames?: string[]) {
    const users = await this.synchronization.synchronizeUsersMetrics(usernames);
    this.logger.log(`${users.length} users have been synchronized`);
  }
}
