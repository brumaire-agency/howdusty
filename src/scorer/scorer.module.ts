import { Module } from '@nestjs/common';
import { NormalizationService } from './normalization.service';
import { StandardScaler } from './standard-scaler.service';

@Module({
  providers: [NormalizationService, StandardScaler],
})
export class ScorerModule {}
