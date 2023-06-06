import { Module } from '@nestjs/common';
import { SynchronizationModule } from '@/synchronization';
import { SynchronizeContributorCommand } from './synchronize-contributor.command';

@Module({
  imports: [SynchronizationModule],
  providers: [SynchronizeContributorCommand],
})
export class CommandsModule {}
