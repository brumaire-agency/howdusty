import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { Metrics } from './metrics.entity';
import { ContributorDto } from '@/contributors';

export class MetricsRepositoryMock {
  contributorsMetrics: any[] = [];

  createQueryBuilder(alias: string): any {
    // Simulate the behavior of TypeORM's createQueryBuilder
    const queryBuilder = {
      username: '',
      alias,
      leftJoinAndSelect: () => queryBuilder,
      getMany: () => {
        return this.contributorsMetrics;
      },
      where: (conditions: any, userName: { username: string }): any => {
        const username = userName.username;
        queryBuilder.username = username;
        return queryBuilder;
      },
      getOne: () => {
        const result = this.contributorsMetrics.find(
          (item) => item.contributor.username === queryBuilder.username,
        );
        return result;
      },
    };

    return queryBuilder;
  }

  save<T>(contributor: T): Promise<T> {
    const contributors = Array.isArray(contributor)
      ? contributor
      : [contributor];

    for (const element of contributors) {
      const contributorToUpdate = this.contributorsMetrics.findIndex(
        (item) => item.id === element.id,
      );
      if (contributorToUpdate >= 0) {
        // Update
        this.contributorsMetrics[contributorToUpdate] = {
          ...this.contributorsMetrics[contributorToUpdate],
          ...element,
        };
      } else {
        // Create
        this.contributorsMetrics = [...this.contributorsMetrics, element];
      }
    }

    return Promise.resolve(contributor);
  }
}
