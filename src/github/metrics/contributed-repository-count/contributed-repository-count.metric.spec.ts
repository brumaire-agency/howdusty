import { ContributedRepositoryCountMetric } from './contributed-repository-count.metric';
import response from '@/github/metrics/query-response.example.json';

describe('Contributed Repository Count Metric', () => {
  const metric = new ContributedRepositoryCountMetric();

  it('parseResult should return a User', async () => {
    const data = await metric.parseResult(response);
    expect(typeof data.contributedRepositoryCount).toBe('number');
  });
});
