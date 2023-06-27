import { Test, TestingModule } from '@nestjs/testing';
import { OnlydustApi } from './onlydust.api';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';

describe('OnlydustService', () => {
  let api: OnlydustApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [OnlydustApi],
    }).compile();

    api = module.get<OnlydustApi>(OnlydustApi);
  });

  it('should be defined', async () => {
    await api.getUsers();
  });
});
