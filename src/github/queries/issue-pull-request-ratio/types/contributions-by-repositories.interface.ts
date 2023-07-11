import { RepositoriesQuery } from '@/github/queries/helpers';

export interface ContributionsByRepository extends RepositoriesQuery {
  contributions: {
    totalCount: number;
  };
}
