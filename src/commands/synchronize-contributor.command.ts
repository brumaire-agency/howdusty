import { Command, CommandRunner } from 'nest-commander';
import { SynchronizationService } from '../synchronization/synchronization.service';

@Command({
  name: 'synchronize-contributor',
})
export class SynchronizeContributorCommand extends CommandRunner {
  constructor(private synchronization: SynchronizationService) {
    super();
  }

  async run(usernames: string[]) {
    for (const username of usernames) {
      const user = await this.synchronization.githubUser(username);
      if (user) {
        console.log(`The user ${username} has been synchronized`);
      } else {
        console.log(`The user ${username} could not been synchronized`);
      }
    }
  }
}
