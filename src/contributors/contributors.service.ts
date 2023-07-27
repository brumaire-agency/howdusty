import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContributorDto } from './contributor.dto';
import { Contributor } from './contributor.entity';
import { ContributorOldModel } from './types';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private contributorsRepository: Repository<Contributor>,
  ) {}

  async findAll(): Promise<ContributorOldModel[]> {
    const results = await this.contributorsRepository.find({
      relations: { metrics: true },
    });
    return results.map((contributor: Contributor) =>
      this.contributorOldModel(contributor),
    );
  }

  async findOneByUsername(username: string): Promise<ContributorOldModel> {
    const contributor = await this.contributorsRepository.findOne({
      where: { username: username },
      relations: { metrics: true },
    });

    if (!contributor) {
      return null;
    }

    return this.contributorOldModel(contributor);
  }

  async save(contributorDto) {
    return await this.contributorsRepository.save(contributorDto);
  }

  private contributorOldModel(contributor: Contributor) {
    const { metrics, ...rest } = contributor;
    return {
      ...rest,
      ...metrics,
    };
  }
}
