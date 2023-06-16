import { Module } from '@nestjs/common';
import { NormalizationService } from './normalization.service';
import { StandardScaler } from './standard-scaler.service';
import { ScorerService } from './scorer.service';

@Module({
  providers: [NormalizationService, ScorerService, StandardScaler],
  exports: [ScorerService],
})
export class ScorerModule {}
