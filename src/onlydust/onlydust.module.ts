import { Module } from '@nestjs/common';
import { OnlydustApi } from './onlydust.api';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [OnlydustApi],
})
export class OnlydustModule {}
