import { Controller, Get } from '@nestjs/common';
import { ContributorsService } from './contributors.service';
import { ContributorEntity } from './entity/contributor.entity';

@Controller('contributors')
export class ContributorsController {
  constructor(private contributorsService: ContributorsService) {}

  @Get()
  async findAll(): Promise<ContributorEntity[]> {
    return this.contributorsService.findAll();
  }
}
