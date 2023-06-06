import { Module } from '@nestjs/common';
import { SynchronizeContributorCommand } from '@/commands/synchronize-contributor.command';
import { SynchronizationModule } from '@/synchronization';

@Module({
  imports: [SynchronizationModule],
  providers: [SynchronizeContributorCommand],
})
export class CommandsModule {}
