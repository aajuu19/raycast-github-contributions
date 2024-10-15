import { TContributionCalendar, TContributionResponse } from "../types/common";

const GITHUB_API_URL = process.env.GITHUB_API_URL;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const baseQuery = `
{
  user(login: "${GITHUB_USERNAME}") {
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

export async function fetchContributions(): Promise<TContributionCalendar | void> {
  try {
    if (!GITHUB_API_URL || !GITHUB_TOKEN) {
      throw new Error("Make sure your env variables are setup correctly");
    }

    const response = await fetch(GITHUB_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query: baseQuery }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data: TContributionResponse = await response.json();

    return data.data.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("An error occured man", error);
  }
}
