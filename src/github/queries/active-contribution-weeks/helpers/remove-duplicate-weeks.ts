import { WeekObject } from '../types';

/**
 * Remove all duplicate weeks.
 */
export const removeDuplicateWeeks = (weeks: WeekObject[]): WeekObject[] => {
  return weeks.filter(
    (week, index) =>
      weeks.findIndex(
        (item) =>
          item.weekNumber === week.weekNumber && item.year === week.year,
      ) === index,
  );
};
