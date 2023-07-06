import { TotalContributionsMetric } from './total-contributions.metric';
import response from '@/metrics/query-response.example.json';

describe('Total Contributions Metric', () => {
  const metric = new TotalContributionsMetric();

  it('parseResult should return a User', async () => {
    const data = await metric.parseResult(response);
    expect(typeof data.totalContributions).toBe('number');
  });
});
