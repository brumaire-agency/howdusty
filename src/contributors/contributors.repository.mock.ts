import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { Contributor } from './contributor.entity';
import { ContributorDto } from './contributor.dto';
import { ContributorModel } from './types';

export class ContributorsRepositoryMock {
  contributors: ContributorModel[] = [];

  find(): Promise<ContributorModel[]> {
    return Promise.resolve(this.contributors);
  }

  findOne(options: FindOneOptions<Contributor>): Promise<ContributorModel> {
    const contributorWhere = options.where as FindOptionsWhere<Contributor>;
    return Promise.resolve(
      this.contributors.find(
        (contributor: Contributor) =>
          contributor.username == contributorWhere.username,
      ),
    );
  }

  save<T>(contributor: T): Promise<T> {
    const contributors = Array.isArray(contributor)
      ? contributor
      : [contributor];

    for (const element of contributors) {
      const contributorToUpdate = this.contributors.findIndex(
        (item) => item.id === element.id,
      );
      if (contributorToUpdate >= 0) {
        // Update
        this.contributors[contributorToUpdate] = {
          ...this.contributors[contributorToUpdate],
          ...element,
        };
      } else {
        // Create
        this.contributors = [...this.contributors, element];
      }
    }

    return Promise.resolve(contributor);
  }
}
