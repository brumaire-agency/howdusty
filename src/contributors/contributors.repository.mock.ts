import { Repository } from 'typeorm';
import { ContributorDto } from './contributor.dto';
import { Contributor } from './contributor.entity';

export class ContributorsRepositoryMock extends Repository<Contributor> {
  contributors: Contributor[] = [
    {
      id: 'usernameid',
      username: 'username',
      name: 'User name',
      avatarUrl: 'https://username.com',
    },
  ];

  newContributor: ContributorDto = {
    id: 'newusernameid',
    username: 'newusername',
    name: 'New User Name',
    avatarUrl: 'https://newusername.com',
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
