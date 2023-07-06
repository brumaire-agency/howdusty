import { RepositoriesQuery } from '@/metrics/helpers';

export interface ContributionsByRepository extends RepositoriesQuery {
  contributions: {
    nodes?: { occurredAt: string }[];
  };
}
