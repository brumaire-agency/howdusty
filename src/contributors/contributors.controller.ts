import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ContributorsService } from './contributors.service';
import { Contributor } from './contributor.entity';
import { ContributorOldModel } from './types';

@Controller('contributors')
export class ContributorsController {
  constructor(private readonly service: ContributorsService) {}

  @Get()
  async findAll(): Promise<ContributorOldModel[]> {
    return this.service.findAll();
  }

  @Get(':username')
  async findOneByUsername(
    @Param('username') username: string,
  ): Promise<ContributorOldModel> {
    const contributor = await this.service.findOneByUsername(username);
    if (!contributor) {
      throw new NotFoundException('Contributor not found');
    }
    return contributor;
  }
}
