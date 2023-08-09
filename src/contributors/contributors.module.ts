import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';
import { ContributorsService } from './contributors.service';
import { ContributorsController } from './contributors.controller';
import { MetricsModule } from '@/metrics';
// import { SynchronizationModule } from '@/synchronization';
import { ScorerModule } from '@/scorer';
import { GithubModule } from '@/github';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contributor]),
    MetricsModule,
    ScorerModule,
    GithubModule,
  ],
  providers: [ContributorsService],
  exports: [ContributorsService],
  controllers: [ContributorsController],
})
export class ContributorsModule {}
