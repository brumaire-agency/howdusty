import { Module } from '@nestjs/common';
import { SynchronizationModule } from '@/synchronization';
import { SynchronizeContributorCommand } from './synchronize-contributor.command';
import { ScoreContributorsCommand } from './score-contributors.command';
import { OnlydustImportCommand } from './onlydust-import.command';
import { ContributorsModule } from '@/contributors';
import { OnlydustModule } from '@/onlydust';

@Module({
  imports: [ContributorsModule, OnlydustModule, SynchronizationModule],
  providers: [
    OnlydustImportCommand,
    ScoreContributorsCommand,
    SynchronizeContributorCommand,
  ],
})
export class CommandsModule {}
