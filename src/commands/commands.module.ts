import { Module } from '@nestjs/common';
import { SynchronizeContributorCommand } from './synchronize-contributor.command';
import { SynchronizationModule } from '../synchronization/synchronization.module';

@Module({
  imports: [SynchronizationModule],
  providers: [SynchronizeContributorCommand],
})
export class CommandsModule {}
