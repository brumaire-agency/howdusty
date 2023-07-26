import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContributorDto } from './contributor.dto';
import { Contributor } from './contributor.entity';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private contributorsRepository: Repository<Contributor>,
  ) {}

  async findAll() {
    const results = await this.contributorsRepository.find({
      relations: { metric: true },
    });
    return results.map((contributor: Contributor) =>
      this.contributorOldModel(contributor),
    );
  }

  async findOneByUsername(username: string) {
    const contributor = await this.contributorsRepository.findOne({
      where: { username: username },
      relations: { metric: true },
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
    const { metric, ...rest } = contributor;
    return {
      ...rest,
      ...metric,
    };
  }
}
