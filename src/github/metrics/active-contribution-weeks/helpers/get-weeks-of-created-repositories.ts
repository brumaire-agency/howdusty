import { getOpenSourceContributionsRepositories } from '@/github/metrics/helpers';
import { transformToWeekObject } from './transform-to-week-object';
import { WeekObject, CreatedRepositories } from '../types';

/**
 * Collect all occurredAt and convert to week object for created repositories
 */
export function getWeeksOfCreatedRepositories(
  createdRepositories: CreatedRepositories[],
): WeekObject[] {
  // Get all contributions from open source repositories
  const openSourceRepositories =
    getOpenSourceContributionsRepositories(createdRepositories);
  // Collect and transform weeks
  const weeks: WeekObject[] = [];
  for (const repository of openSourceRepositories) {
    weeks.push(transformToWeekObject(repository.occurredAt));
  }
  return weeks;
}
