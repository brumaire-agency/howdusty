import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
} from '@nestjs/common';
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

  @Post('/contributor')
  async addContributor(
    @Body('username') username: string,
  ): Promise<ContributorOldModel> {
    const syncedContributor = await this.service.addContributor(username);
    return syncedContributor;
  }
}
