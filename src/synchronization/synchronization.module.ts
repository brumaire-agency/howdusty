import { Module } from '@nestjs/common';
import { ContributorsModule } from '@/contributors';
import { GithubModule } from '@/github';
import { SynchronizationService } from '@/synchronization/synchronization.service';

@Module({
  imports: [ContributorsModule, GithubModule],
  providers: [SynchronizationService],
  exports: [SynchronizationService],
})
export class SynchronizationModule {}
