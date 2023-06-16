import {
  WeekObject,
  ContributionsByRepository,
} from '@/github/metrics/active-contribution-weeks/types';
import { getOpenSourceRepositories } from '@/github/metrics/helpers';
import { transformToWeekObject } from './transform-to-week-object';

/**
 * Collect all occurredAt and convert to week object for contributions by repositories
 */
export function getWeeksOfContributions(
  contributionsByRepositories: ContributionsByRepository[],
): WeekObject[] {
  // Get all contributions from open source repositories
  const openSourceContributionsByRepositories = getOpenSourceRepositories(
    contributionsByRepositories,
  );
  // Collect and transform weeks
  const weeks: WeekObject[] = [];
  for (const contributionsByRepository of openSourceContributionsByRepositories) {
    for (const contribution of contributionsByRepository.contributions.nodes) {
      weeks.push(transformToWeekObject(contribution.occurredAt));
    }
  }
  return weeks;
}
