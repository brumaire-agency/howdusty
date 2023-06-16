import { RepositoriesQuery } from '@/github/metrics/helpers';

export interface ContributionsByRepository extends RepositoriesQuery {
  contributions: {
    nodes?: { occurredAt: string }[];
  };
}
