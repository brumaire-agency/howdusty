import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContributorDto } from './contributor.dto';
import { Contributor } from './contributor.entity';
import { ContributorOldModel } from './types';
import { SynchronizationService } from '@/synchronization';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private contributorsRepository: Repository<Contributor>,
    private synchronization: SynchronizationService,
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

  async addContributor(username: string): Promise<ContributorOldModel> {
    const contributor = await this.findOneByUsername(username);
    if (contributor) {
      return contributor;
    }

    await this.synchronization.synchronizeUser(username);
    await this.synchronization.synchronizeUsersMetrics([username]);
    await this.synchronization.scoreUsers();

    const syncedContributor = await this.findOneByUsername(username);
    return syncedContributor;
  }

  private contributorOldModel(contributor: Contributor) {
    const { metrics, ...rest } = contributor;
    return {
      ...rest,
      ...metrics,
    };
  }
}
