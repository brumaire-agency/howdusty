import { Module } from '@nestjs/common';
import { OnlydustApi } from './onlydust.api';
import { ConfigModule } from '@nestjs/config';
import { OnlydustService } from './onlydust.service';

@Module({
  imports: [ConfigModule],
  providers: [OnlydustService, OnlydustApi],
  exports: [OnlydustService],
})
export class OnlydustModule {}
