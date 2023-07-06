import { RepositoriesQuery } from '@/metrics/helpers';

export interface CreatedRepositories extends RepositoriesQuery {
  occurredAt: string;
}
