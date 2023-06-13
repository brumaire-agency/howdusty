import { ContributedRepositoryCountMetric } from './contributed-repository-count.metric';
import response from './query-response.example.json';

describe('TotalContributions Metric', () => {
  const metric = new ContributedRepositoryCountMetric();

  it('parseResult should return a User', async () => {
    const data = await metric.parseResult(response);
    expect(typeof data.contributedRepositoryCount).toBe('number');
  });
});
