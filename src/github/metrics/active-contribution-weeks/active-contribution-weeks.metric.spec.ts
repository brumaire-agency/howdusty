import response from '@/github/metrics/query-response.example.json';
import { ActiveContributionWeeksMetric } from './active-contribution-weeks.metric';

describe('Active Contribution Weeks Metric', () => {
  const metric = new ActiveContributionWeeksMetric();

  it('parseResult should return a User', async () => {
    const data = await metric.parseResult(response);
    expect(typeof data.activeContributionWeeks).toBe('number');
  });
});
