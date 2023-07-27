import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';
import { ContributorsService } from './contributors.service';
import { ContributorsController } from './contributors.controller';
import { MetricsModule } from '@/metrics';

@Module({
  imports: [TypeOrmModule.forFeature([Contributor]), MetricsModule],
  providers: [ContributorsService],
  exports: [ContributorsService],
  controllers: [ContributorsController],
})
export class ContributorsModule {}
