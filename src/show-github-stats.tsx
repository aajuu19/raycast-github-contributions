import { MenuBarExtra } from "@raycast/api";
import { useFetch } from "@raycast/utils";

export default function Command() {
  const { isLoading, data, error } = useFetch("https://api.github.com/graphql", {
    headers: {
      Authentication: "Bearer <BEARER-HERE>",
    },
  });

  return (
    <MenuBarExtra tooltip="Your Pull Requests" title="🔥 1 - 🍎 3">
      <MenuBarExtra.Section title="Streaks">
        <MenuBarExtra.Item
          title={`🔥 ${isLoading ? "🕸️" : data?.name}`}
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
