import { Module } from '@nestjs/common';
import { SynchronizationModule } from '@/synchronization';
import { SynchronizeContributorCommand } from './synchronize-contributor.command';
import { ScoreContributorsCommand } from './score-contributors.command';

@Module({
  imports: [SynchronizationModule],
  providers: [ScoreContributorsCommand, SynchronizeContributorCommand],
})
export class CommandsModule {}
