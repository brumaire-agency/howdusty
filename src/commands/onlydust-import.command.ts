import { ContributorsService } from '@/contributors';
import { UserNotFoundException } from '@/github';
import { OnlydustService } from '@/onlydust';
import { SynchronizationService } from '@/synchronization';
import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';

/**
 * Import new OnlyDust users in the database.
 */
@Command({
  name: 'onlydust:import',
})
export class OnlydustImportCommand extends CommandRunner {
  private readonly logger = new Logger(OnlydustImportCommand.name);

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

    // Helper function to check if a username is a GitHub bot
    function isGitHubBot(username: string): boolean {
      return /\[bot\]$/.test(username);
    }

    // Only import onlydust users not present on our database and not GitHub bots
    const newOnlydustUsernames = onlydustUsers
      .filter(
        (user) =>
          !contributors.includes(user.login) && !isGitHubBot(user.login),
      )
      .map((user) => user.login);

    for (const key in newOnlydustUsernames) {
      try {
        const user = await this.synchronization.synchronizeUser(
          newOnlydustUsernames[key],
        );
        this.logger.log(
          `synchronizing ${user.username}, ${parseInt(key) + 1}/${
            newOnlydustUsernames.length
          }`,
        );
      } catch (error) {
        if (error instanceof UserNotFoundException) {
          this.logger.error(error.message);
          this.logger.warn(
            `warning: could not synchronize ${newOnlydustUsernames[key]}`,
          );
        } else {
          throw error;
        }
      }
    }
  }
}
