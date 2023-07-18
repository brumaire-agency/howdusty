import { Contributor } from './contributor.entity';

export class ContributorsRepositoryMock {
  contributors: Contributor[] = [];

  find(): Promise<Contributor[]> {
    return Promise.resolve(this.contributors);
  }

  findOne(): Promise<Contributor> {
    return Promise.resolve(this.contributors[0]);
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
