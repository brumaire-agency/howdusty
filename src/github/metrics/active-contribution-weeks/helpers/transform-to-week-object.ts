import { WeekObject } from '../types';

/**
 * Return the year and the week number of a string date.
 */
export const transformToWeekObject = (date: string): WeekObject => {
  // Get the current date and his year
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  // Get the first day of the current year
  const firstDayOfYear = new Date(year, 0, 1);
  //  Calculate the difference between the two dates in days
  const days = Math.floor(
    (currentDate.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000),
  );
  // Get the week number
  const weekNumber = Math.ceil(days / 7);

  return {
    year: year,
    weekNumber: weekNumber,
  };
};
