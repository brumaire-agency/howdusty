import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { GithubApiMock } from './github.api.mock';
import { GithubApi } from './github.api';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let github: GithubService;
  let api: GithubApiMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [
        GithubService,
        { provide: GithubApi, useClass: GithubApiMock },
      ],
    }).compile();

    github = module.get<GithubService>(GithubService);
    api = module.get<GithubApiMock>(GithubApi);
  });

  describe('getContributorInfo', () => {
    it('should return a User', async () => {
      expect(await github.getContributorInfo(api.user.username)).toStrictEqual(
        api.user,
      );
    });
  });
});
