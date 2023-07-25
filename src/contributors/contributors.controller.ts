import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { MetricsService } from '@/metrics';
import { ContributorDto } from './contributor.dto';

@Controller('contributors')
export class ContributorsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async findAll(): Promise<ContributorDto[]> {
    return await this.metricsService.findAll();
  }

  @Get(':username')
  async findOneByUsername(
    @Param('username') username: string,
  ): Promise<ContributorDto> {
    const contributor = await this.metricsService.findOneByUsername(username);
    if (!contributor) {
      throw new NotFoundException('Contributor not found');
    }
    return contributor;
  }
}
