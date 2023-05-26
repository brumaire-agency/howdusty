import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContributorsModule } from './contributors/contributors.module';
import configuration from './config/configuration';
import { ContributorEntity } from './contributors/entity/contributor.entity';

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
          entities: [ContributorEntity],
          synchronize: true,
        };
      },
    }),
    ContributorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
