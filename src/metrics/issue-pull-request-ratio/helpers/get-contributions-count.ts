import { getOpenSourceContributionsRepositories } from '@/metrics/helpers';
import { ContributionsByRepository } from '../types';

/**
 * Return contributions count
 */
export function getContributionsCount(
  contributionsByRepositories: ContributionsByRepository[],
): number {
  // Get all contributions from open source repositories
  const openSourceContributionsByRepositories =
    getOpenSourceContributionsRepositories(contributionsByRepositories);
  // Get total of contributions
  let contributionsCount = 0;
  openSourceContributionsByRepositories.forEach((contributionByRepository) => {
    contributionsCount =
      contributionsCount + contributionByRepository.contributions.totalCount;
  });
  return contributionsCount;
}
