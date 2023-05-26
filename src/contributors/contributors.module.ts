import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContributorEntity } from './entity/contributor.entity';
import { ContributorsController } from './contributors.controller';
import { ContributorsService } from './contributors.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContributorEntity])],
  controllers: [ContributorsController],
  providers: [ContributorsService],
})
export class ContributorsModule {}
