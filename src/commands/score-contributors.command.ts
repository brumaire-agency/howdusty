import { Command, CommandRunner } from 'nest-commander';
import { SynchronizationService } from '@/synchronization';

@Command({
  name: 'contributors:score',
})
export class ScoreContributorsCommand extends CommandRunner {
  /**
   * The class constructor.
   */
  constructor(private synchronization: SynchronizationService) {
    super();
  }

  /**
   * @inheritDoc
   */
  async run(): Promise<void> {
    await this.synchronization.scoreUsers();
  }
}
