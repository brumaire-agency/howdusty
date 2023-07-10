import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/config/configuration';
import { Contributor, ContributorsModule } from '@/contributors';
import { GithubModule } from '@/github';
import { OnlydustModule } from '@/onlydust';
import { SynchronizationModule } from '@/synchronization';
import { CommandsModule } from '@/commands';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { host, port, database, username, password, type } =
          configService.get('database');
        return {
          type,
          host,
          port,
          database,
          username,
          password,
          entities: [Contributor],
          synchronize: true,
        };
      },
    }),
    ContributorsModule,
    GithubModule,
    SynchronizationModule,
    CommandsModule,
    OnlydustModule,
    MetricsModule,
  ],
})
export class AppModule {}
