import { Command, CommandRunner } from 'nest-commander';
import { SynchronizationService } from '@/synchronization';

/**
 * Synchronize contributors with the github API.
 */
@Command({
  name: 'contributors:sync',
})
export class SynchronizeContributorCommand extends CommandRunner {
  constructor(private synchronization: SynchronizationService) {
    super();
  }

  async run(usernames?: string[]) {
    const users = await this.synchronization.synchronizeUsers(usernames);
    console.log(`${users.length} users have been synchronized`);
  }
}
