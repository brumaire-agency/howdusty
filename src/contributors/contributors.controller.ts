import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ContributorsService } from './contributors.service';
import { Contributor } from './contributor.entity';

@Controller('contributors')
export class ContributorsController {
  constructor(private readonly service: ContributorsService) {}

  @Get()
  async findAll(): Promise<Contributor[]> {
    return this.service.findAll();
  }

  @Get(':username')
  async findOneByUsername(
    @Param('username') username: string,
  ): Promise<Contributor> {
    const contributor = await this.service.findOneByUsername(username);
    if (!contributor) {
      throw new NotFoundException('Contributor not found');
    }
    return contributor;
  }
}
