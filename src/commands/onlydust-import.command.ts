import { ContributorsService } from '@/contributors';
import { UserNotFoundException } from '@/github';
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

  // Helper function to check if a username is a GitHub bot
  isGitHubBot(username: string): boolean {
    return /\[bot\]$/.test(username);
  }

  async run() {
    const onlydustUsers = await this.onlydust.getUsers();
    const contributors = (await this.contributors.findAll()).map(
      (user) => user.username,
    );

    // Only import onlydust users not present on our database and not GitHub bots
    const newOnlydustUsernames = onlydustUsers
      .filter(
        (user) =>
          !contributors.includes(user.login) && !this.isGitHubBot(user.login),
      )
      .map((user) => user.login);

    for (const key in newOnlydustUsernames) {
      try {
        const user = await this.synchronization.synchronizeUser(
          newOnlydustUsernames[key],
        );
        console.log(
          `synchronizing ${user.username}, ${parseInt(key) + 1}/${
            newOnlydustUsernames.length
          }`,
        );
      } catch (error) {
        if (error instanceof UserNotFoundException) {
          console.log(error.message);
          console.log(
            `warning: could not synchronize ${newOnlydustUsernames[key]}`,
          );
        } else {
          throw error;
        }
      }
    }
  }
}
