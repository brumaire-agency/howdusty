import { Test, TestingModule } from '@nestjs/testing';
import { ContributorsController } from './contributors.controller';
import { ContributorsService } from './contributors.service';
import { ContributorEntity } from './entity/contributor.entity';

describe('ContributorsController', () => {
  let contributorController: ContributorsController;
  let contributorService: ContributorsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ContributorsController],
      providers: [ContributorsService],
    }).compile();
    contributorService =
      moduleRef.get<ContributorsService>(ContributorsService);
    contributorController = moduleRef.get<ContributorsController>(
      ContributorsController,
    );
  });

  describe('findAll', () => {
    it('should return an array of contributors', async () => {
      const result: ContributorEntity[] = [
        {
          id: 1,
          username: 'username',
          name: 'John Doe',
          avatar_url: 'https://avatarurl.com',
        },
      ];
      jest
        .spyOn(contributorService, 'findAll')
        .mockImplementation(() => result);

      expect(await contributorController.findAll()).toBe(result);
    });
  });
});
