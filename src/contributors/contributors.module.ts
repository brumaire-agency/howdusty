import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';
import { ContributorsService } from './contributors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contributor])],
  providers: [ContributorsService],
  exports: [ContributorsService],
})
export class ContributorsModule {}
