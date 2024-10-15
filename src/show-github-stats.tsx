import { MenuBarExtra } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { format, startOfMonth } from "date-fns";
import { TContributionResponse } from "./types/common";
import { getContributionsByDate } from "./utils/getContributionsByDate";
import { calculateStreak } from "./utils/calculateStreak";

const baseQuery = `
{
  user(login: "aajuu19") {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`;

export default function Command() {
  const { isLoading, data, error } = useFetch<TContributionResponse>("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer <TOKEN>`,
    },
    body: JSON.stringify({ query: baseQuery }),
  });

  const contributionCalendar = data?.data.user.contributionsCollection.contributionCalendar;

  if (error || !data || !contributionCalendar) return null;

  const contributionDays = contributionCalendar.weeks.flatMap((week) => week.contributionDays);

  const today = format(new Date(), "yyyy-MM-dd");
  const currentMonth = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const past30Days = format(new Date(new Date().setDate(new Date().getDate() - 30)), "yyyy-MM-dd");
  const oneYearAgo = format(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), "yyyy-MM-dd");

  // Contributions for today
  const todayContributions = getContributionsByDate(contributionDays, (date) => date === today);

  // Contributions for this month
  const thisMonthContributions = getContributionsByDate(contributionDays, (date) => date >= currentMonth);

  // Contributions for the past 30 days
  const past30DaysContributions = getContributionsByDate(contributionDays, (date) => date >= past30Days);

  // Contributions for the past 365 days
  const yearContributions = getContributionsByDate(contributionDays, (date) => date >= oneYearAgo);

  const { currentStreak, longestStreak } = calculateStreak(contributionDays);

  return (
    <MenuBarExtra tooltip="Your contribution stats" title={`🔥 ${currentStreak} - 🍎 ${longestStreak}`}>
      <MenuBarExtra.Section title="Streaks">
        <MenuBarExtra.Item title={`🔥 ${currentStreak}`} subtitle=" - Current Streak" onAction={() => {}} />
        <MenuBarExtra.Item title={`🍎 ${longestStreak}`} subtitle=" - Longest Streak" onAction={() => {}} />
      </MenuBarExtra.Section>
      <MenuBarExtra.Section title="Contribution stats">
        <MenuBarExtra.Item title={`👨🏻‍💻 ${todayContributions}`} subtitle=" - Today" onAction={() => {}} />
        <MenuBarExtra.Item title={`💼 ${thisMonthContributions}`} subtitle=" - This month" onAction={() => {}} />
        <MenuBarExtra.Item title={`🗓️ ${past30DaysContributions}`} subtitle=" - Last 30 days" onAction={() => {}} />
        <MenuBarExtra.Item title={`📊 ${yearContributions}`} subtitle=" - Last 365 days" onAction={() => {}} />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}
