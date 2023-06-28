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
});
