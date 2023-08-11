import { Test, TestingModule } from '@nestjs/testing';
import { OnlydustApi } from './onlydust.api';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { OnlydustService } from './onlydust.service';
import { OnlydustApiMock } from './onlydust.api.mock';

describe('OnlydustService', () => {
  let onlydust: OnlydustService;
  let api: OnlydustApiMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        OnlydustService,
        OnlydustApi,
        { provide: OnlydustApi, useClass: OnlydustApiMock },
      ],
    }).compile();

    onlydust = module.get(OnlydustService);
    api = module.get<OnlydustApiMock>(OnlydustApi);
  });

  describe('getUsers', () => {
    it('should return all onlydust users', async () => {
      const result = await onlydust.getUsers();
      expect(result).toStrictEqual(api.users);
      expect(result.length).toBe(3);
    });
  });

  describe('getMetricsForAll', () => {
    it('should return all metrics for onlydust users', async () => {
      const result = await onlydust.getMetricsForAll([
        'username1',
        'username2',
        'username3',
      ]);
      expect(result).toStrictEqual({
        collectedGrant: { username1: 100, username2: 100, username3: 100 },
        meanGrantPerProject: { username1: 10, username2: 10, username3: 10 },
        contributedProjectCount: {
          username1: 5,
          username2: 5,
          username3: 5,
        },
        contributionCount: { username1: 20, username2: 20, username3: 20 },
      });
    });
  });
});
