import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContributorDto } from './contributor.dto';
import { Contributor } from './contributor.entity';
import { ContributorOldModel } from './types';
import { ScorerService } from '@/scorer';
import { MetricsService } from '@/metrics';
import { GithubService } from '@/github';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private contributorsRepository: Repository<Contributor>,
    private metrics: MetricsService,
    private scorer: ScorerService,
    private github: GithubService,
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

    const userInfo = await this.github.getContributorInfo(username);
    const user = { ...userInfo };
    await this.save(user);

    const usersMetrics = await this.metrics.getMetricsForUsers([username]);

    const newUserInfo = await this.findOneByUsername(username);
    const newUser = {
      id: newUserInfo.id,
      ...usersMetrics[username],
      contributor: newUserInfo,
    };
    await this.metrics.save(newUser);

    const contributors = await this.findAll();
    const scoredContributors = this.scorer.score(contributors);
    await this.save(
      scoredContributors.map((contributor) => ({
        id: contributor.id,
        rank: contributor.rank,
        score: contributor.score,
      })),
    );

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
