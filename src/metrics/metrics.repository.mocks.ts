import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { Metrics } from './metrics.entity';
import { ContributorDto } from '@/contributors';

export class MetricsRepositoryMock {
  contributorsMetrics: ContributorDto[] = [];

  find(): Promise<ContributorDto[]> {
    return Promise.resolve(this.contributorsMetrics);
  }

  findOne(options: any): Promise<ContributorDto> {
    return Promise.resolve(this.contributorsMetrics[0]);
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
