import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { GithubModule } from '@/github';
import configuration from '@/config/configuration';
import { ConfigModule } from '@nestjs/config';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        GithubModule,
      ],
      providers: [MetricsService],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  // it('should be defined', async () => {
  //   await service.getMetricsForUsers(['zoemeriet', 'robinstraub']);
  // });
});
