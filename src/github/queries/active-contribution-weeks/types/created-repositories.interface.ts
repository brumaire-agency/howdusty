import { RepositoriesQuery } from '@/github/queries/helpers';

export interface CreatedRepositories extends RepositoriesQuery {
  occurredAt: string;
}
