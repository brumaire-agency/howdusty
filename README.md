# HowDusty
HowDusty collects data about contributors. it processes it into meaningful information and presents them into visualisation tools to get to know contributors.

## Features
- Initial Reputation Score: Assign new users an initial reputation score based on their previous activity on GitHub, such as repositories they have contributed to, commits, pull requests, followers, and languages they work with.
- Project-based Reputation: Calculate additional reputation points using the weekly work estimation (number of working days) and the associated sum of money allocated by the project lead.
- Platform-specific Metrics: Incorporate metrics such as project completion rate, peer reviews, and responsiveness into the reputation system.
- Dynamic Reputation Score: Update reputation scores in realtime, considering all the factors mentioned above.
- Reputation Leaderboard: Create a leaderboard that ranks developers based on their reputation scores.

## Architecture
Look at the [NestJs documentation](https://docs.nestjs.com/) to learn more.

## Getting started

```bash
npm install
npm run start
```

## Roadmap
- add more metrics (e.g. social network influence)
- gamification (badge system / experience bar)
- make it work on a broader scale than OnlyDust