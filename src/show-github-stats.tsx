import { MenuBarExtra } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { TContributionResponse } from "./types/common";

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

  return (
    <MenuBarExtra tooltip="Your Pull Requests" title="🔥 1 - 🍎 3">
      <MenuBarExtra.Section title="Streaks">
        <MenuBarExtra.Item
          title={`🔥 ${isLoading ? "🕸️" : data?.data.user.contributionsCollection.contributionCalendar.totalContributions}`}
          subtitle=" - Contribution Streak"
          onAction={() => {}}
        />
        <MenuBarExtra.Item title="🍎 4" subtitle=" - Longest Streak" onAction={() => {}} />
      </MenuBarExtra.Section>
      <MenuBarExtra.Section title="Contribution stats">
        <MenuBarExtra.Item title="👨🏻‍💻7" subtitle=" - Today" onAction={() => {}} />
        <MenuBarExtra.Item title="💼 28" subtitle=" - This month" onAction={() => {}} />
        <MenuBarExtra.Item title="🗓️ 30" subtitle=" - Last 30 days" onAction={() => {}} />
        <MenuBarExtra.Item title="📊 106" subtitle=" - Last 365 days" onAction={() => {}} />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}
