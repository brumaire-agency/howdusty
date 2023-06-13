import { ContributorDto } from './contributor.dto';
import { Contributor } from './contributor.entity';
import { ContributorFactory } from './contributor.factory';

export class ContributorsRepositoryMock {
  contributors: Contributor[] = [ContributorFactory.generate()];

  newContributor: ContributorDto = {
    id: 'newusernameid',
    username: 'newusername',
    name: 'New User Name',
    avatarUrl: 'https://newusername.com',
    totalContributions: 3,
    contributedRepositoryCount: 1,
    maintainedRepositoryCount: 1,
  };

  find(): Promise<Contributor[]> {
    return Promise.resolve(this.contributors);
  }

  save<Contributor>(contributor): Promise<Contributor> {
    const contributorToUpdate = this.contributors.findIndex(
      (item) => item.id === contributor.id,
    );
    if (contributorToUpdate >= 0) {
      // Update
      this.contributors[contributorToUpdate] = contributor;
    } else {
      // Create
      this.contributors = [...this.contributors, contributor];
    }
    return Promise.resolve(contributor);
  }
}
