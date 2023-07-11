import { Module } from '@nestjs/common';
import { OnlydustApi } from './onlydust.api';
import { OnlydustApiMock } from './onlydust.api.mock';
import { OnlydustService } from './onlydust.service';

@Module({
  imports: [],
  providers: [
    {
      provide: OnlydustApi,
      useClass: OnlydustApiMock,
    },
    OnlydustService,
  ],
  exports: [OnlydustService],
})
export class OnlydustTestingModule {}
