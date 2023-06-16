import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';
import { ContributorsService } from './contributors.service';
import { ContributorsController } from './contributors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Contributor])],
  providers: [ContributorsService],
  exports: [ContributorsService],
  controllers: [ContributorsController],
})
export class ContributorsModule {}
