import { OnlydustService } from '@/onlydust';
import { SynchronizationService } from '@/synchronization';
import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'onlydust:import',
})
export class OnlydustImportCommand extends CommandRunner {
  constructor(
    private onlydust: OnlydustService,
    private synchronization: SynchronizationService,
  ) {
    super();
  }

  async run() {
    const onlydustUsers = await this.onlydust.getUsers();
    const users = await this.synchronization.synchronizeUsers(
      onlydustUsers.map((user) => user.login),
    );
    console.log(users.length);

    console.log(`${users.length} users have been imported and synchronized`);
  }
}
