import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { GithubApi } from './github.api';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { User } from './interfaces/user.interface';

describe('GithubService', () => {
  let githubService: GithubService;

  const mockGithubUser: User = {
    username: 'mockUsername',
    name: 'Mock User Name',
    avatarUrl: 'https://mockusername.com',
  };

  const mockGithubApi = {
    getContributorInfo: jest.fn(() => mockGithubUser),
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
        { provide: GithubApi, useValue: mockGithubApi },
      ],
      exports: [GithubApi],
    }).compile();

    githubService = module.get<GithubService>(GithubService);
  });

  describe('getContributorInfo', () => {
    it('should return a User', async () => {
      expect(await githubService.getContributorInfo('mockUsername')).toBe(
        mockGithubUser,
      );
    });
  });
});
