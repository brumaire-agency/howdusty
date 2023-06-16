import { RepositoriesQuery } from '@/github/metrics/helpers';

export interface CreatedRepositories extends RepositoriesQuery {
  occurredAt: string;
}
