import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';
import { ContributorsService } from './contributors.service';
import { ContributorsController } from './contributors.controller';
import { MetricsModule } from '@/metrics';
import { SynchronizationModule } from '@/synchronization';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contributor]),
    MetricsModule,
    SynchronizationModule,
  ],
  providers: [ContributorsService],
  exports: [ContributorsService],
  controllers: [ContributorsController],
})
export class ContributorsModule {}
