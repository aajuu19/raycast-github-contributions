import { MenuBarExtra } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { format, startOfMonth } from "date-fns";
import { TContributionResponse } from "./types/common";
import { getContributionsByDate } from "./utils/getContributionsByDate";
import { calculateStreak } from "./utils/calculateStreak";

export default function Command() {
  const { isLoading, data, error } = useFetch<TContributionResponse>("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer <BEARER>`,
    },
    body: JSON.stringify({
      query: `
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
        `,
    }),
  });

  // If there's a fatal error, show it
  if (error) {
    return (
      <MenuBarExtra tooltip="Error loading contributions">
        <MenuBarExtra.Item title="❌ Failed to fetch" subtitle={String(error)} />
      </MenuBarExtra>
    );
  }

  // Compute your stats only once data is ready
  let title = "Loading…";
  let sections: JSX.Element[] = [];

  if (!isLoading && data) {
    const days = data.data.user.contributionsCollection.contributionCalendar.weeks.flatMap((w) => w.contributionDays);
    const today = format(new Date(), "yyyy-MM-dd");
    const currentMonth = format(startOfMonth(new Date()), "yyyy-MM-dd");
    const past30 = format(new Date(Date.now() - 30 * 86400_000), "yyyy-MM-dd");
    const oneYearAgo = format(new Date(Date.now() - 365 * 86400_000), "yyyy-MM-dd");

    const todayCount = getContributionsByDate(days, (d) => d === today);
    const monthCount = getContributionsByDate(days, (d) => d >= currentMonth);
    const last30Count = getContributionsByDate(days, (d) => d >= past30);
    const yearCount = getContributionsByDate(days, (d) => d >= oneYearAgo);
    const { currentStreak, longestStreak } = calculateStreak(days);

    title = `🔥 ${currentStreak}  🍎 ${longestStreak}  💪 ${todayCount}  📊 ${yearCount}`;

    sections = [
      <MenuBarExtra.Section title="Streaks" key="streaks">
        <MenuBarExtra.Item title={`🔥 ${currentStreak}`} subtitle="Current Streak" />
        <MenuBarExtra.Item title={`🍎 ${longestStreak}`} subtitle="Longest Streak" />
      </MenuBarExtra.Section>,
      <MenuBarExtra.Section title="Stats" key="stats">
        <MenuBarExtra.Item title={`💪 ${todayCount}`} subtitle="Today" />
        <MenuBarExtra.Item title={`📆 ${monthCount}`} subtitle="This Month" />
        <MenuBarExtra.Item title={`🗓️ ${last30Count}`} subtitle="Last 30 Days" />
        <MenuBarExtra.Item title={`📊 ${yearCount}`} subtitle="Last 365 Days" />
      </MenuBarExtra.Section>,
    ];
  }

  return (
    <MenuBarExtra isLoading={isLoading} tooltip="Your GitHub contributions" title={title}>
      {sections}
    </MenuBarExtra>
  );
}
