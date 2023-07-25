import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/config/configuration';
import { Contributor, ContributorsModule } from '@/contributors';
import { CommandsModule } from '@/commands';
import { Metrics } from './metrics/metrics.entity';
import { MetricsModule } from './metrics';

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
          entities: [Contributor, Metrics],
          synchronize: true,
        };
      },
    }),
    ContributorsModule,
    MetricsModule,
    CommandsModule,
  ],
})
export class AppModule {}
