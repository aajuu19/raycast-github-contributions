import { TContributionDay } from "../types/common";

function getLongestStreak(contributionDays: TContributionDay[]): number {
  let longestStreak = 0;

  contributionDays.reduce((acc, day, index) => {
    const hasContributed = !!day.contributionCount;

    if (hasContributed) {
      acc += 1;
    }

    if (!hasContributed || index === contributionDays.length - 1) {
      if (acc > longestStreak) {
        longestStreak = acc;
      }
      acc = 0;
    }

    return acc;
  }, 0);

  return longestStreak;
}

function getCurrentStreak(contributionDays: TContributionDay[]): number {
  // if the second last entry is null, we can be sure that the current streak is 0
  // no need to iterate over the whole array
  if (
    !contributionDays ||
    contributionDays[contributionDays.length - 2].contributionCount === 0
  ) {
    return 0;
  }

  // reverse the array so we can start counting from today
  const reversed = contributionDays.reverse();

  // find the index of the first day without contribution
  // since arrays are 0-indexed, we can just display the index as our result
  // start searching from index 1, since the current day will not always have a contribution
  const currentStreak = reversed.findIndex(
    (day, index) => !day.contributionCount && index > 0,
  );

  const hasContributedToday = !!reversed[0].contributionCount;

  // if we have not contributed today, we should decrease the current streak
  if (!hasContributedToday) {
    return currentStreak - 1;
  }

  // if we have contributed today and have a current streak, return the current streak
  if (hasContributedToday && !!currentStreak) {
    return currentStreak;
  }

  // if we have contributed every day, the findIndex function will return 0
  // in that case, we should return the length of the array
  // which is the number of days we have contributed in a row

  if (currentStreak === 0) {
    return reversed.length;
  }

  // fallback to 0 if whatever edge case
  return 0;
}

export function calculateStreak(contributionDays: TContributionDay[]): {
  currentStreak: number;
  longestStreak: number;
} {
  const longestStreak = getLongestStreak(contributionDays);
  const currentStreak = getCurrentStreak(contributionDays);

  return { currentStreak, longestStreak };
}
