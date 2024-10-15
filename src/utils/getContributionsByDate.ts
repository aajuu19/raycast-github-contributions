import { TContributionDay } from "../types/common";

export function getContributionsByDate(
  contributionDays: TContributionDay[],
  dateCheckFn: (date: string) => boolean,
): number {
  return contributionDays
    .filter((day) => dateCheckFn(day.date))
    .reduce((total, day) => total + day.contributionCount, 0);
}
