import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { GithubApi } from './github.api';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { User } from './interfaces/user.interface';
import { GithubApiMock } from './github.api.mock';

describe('GithubService', () => {
  let githubService: GithubService;

  const mockGithubUser: User = {
    username: 'username',
    name: 'User Name',
    avatarUrl: 'https://username.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [
        ConfigService,
        GithubService,
        GithubApi,
        { provide: GithubApi, useClass: GithubApiMock },
      ],
      exports: [GithubApi],
    }).compile();

    githubService = module.get<GithubService>(GithubService);
  });

  describe('getContributorInfo', () => {
    it('should return a User', async () => {
      expect(await githubService.getContributorInfo('username')).toStrictEqual(
        mockGithubUser,
      );
    });
  });
});
