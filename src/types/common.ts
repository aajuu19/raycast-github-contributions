export type TContributionDay = {
  contributionCount: number;
  date: string;
};

type TWeek = {
  contributionDays: TContributionDay;
};

export type TContributionCalendar = {
  totalContributions: number;
  weeks: TWeek[];
};

export type TContributionResponse = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: TContributionCalendar;
      };
    };
  };
};
