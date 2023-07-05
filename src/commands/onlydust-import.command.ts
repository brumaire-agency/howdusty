import { ContributorsService } from '@/contributors';
import { OnlydustService } from '@/onlydust';
import { SynchronizationService } from '@/synchronization';
import { Command, CommandRunner } from 'nest-commander';

/**
 * Import new OnlyDust users in the database.
 */
@Command({
  name: 'onlydust:import',
})
export class OnlydustImportCommand extends CommandRunner {
  constructor(
    private contributors: ContributorsService,
    private onlydust: OnlydustService,
    private synchronization: SynchronizationService,
  ) {
    super();
  }

  async run() {
    const onlydustUsers = await this.onlydust.getUsers();
    const contributors = (await this.contributors.findAll()).map(
      (user) => user.username,
    );
    // Only import onlydust users not present on our database
    const newOnlydustUsers = onlydustUsers
      .filter((user) => !contributors.includes(user.login))
      .map((user) => user.login);

    const users = await this.synchronization.synchronizeUsers(newOnlydustUsers);
    console.log(`${users.length} users have been imported and synchronized`);
  }
}
