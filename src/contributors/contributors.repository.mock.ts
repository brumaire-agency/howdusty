import { Repository } from 'typeorm';
import { Contributor } from './entity/contributor.entity';
import { ContributorDto } from './dto';

export class ContributorsRepositoryMock extends Repository<Contributor> {
  contributors: Contributor[] = [
    {
      id: 1,
      username: 'username',
      name: 'User name',
      avatarUrl: 'https://username.com',
    },
  ];

  newContributor: ContributorDto = {
    username: 'newusername',
    name: 'New User Name',
    avatarUrl: 'https://newusername.com',
  };

  find(): Promise<Contributor[]> {
    return Promise.resolve(this.contributors);
  }

  save<Contributor>(contributor): Promise<Contributor> {
    const contributorToUpdate = contributor.id
      ? this.contributors.findIndex((item) => item.id === contributor.id)
      : undefined;
    if (contributorToUpdate >= 0) {
      // Update
      this.contributors[contributorToUpdate] = {
        id: contributor.id,
        ...contributor,
      };
    } else {
      // Create
      this.contributors = [
        ...this.contributors,
        {
          id: contributor.id ? contributor.id : this.contributors.length + 1,
          username: contributor.username,
          name: contributor.name,
          avatarUrl: contributor.avatarUrl,
        },
      ];
    }
    return Promise.resolve(contributor);
  }
}
