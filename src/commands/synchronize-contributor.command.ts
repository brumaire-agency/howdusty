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
      console.log(user);
    }
  }
}
