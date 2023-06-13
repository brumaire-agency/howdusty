import { RepositoryMaintainedCountMetric } from './repository-maintained-count.metric';
import response from './query-response.example.json';

describe('Repository Maintained Count Metric', () => {
  const metric = new RepositoryMaintainedCountMetric();

  it('parseResult should return a User', async () => {
    const data = await metric.parseResult(response);
    expect(typeof data.repositoryMaintainedCount).toBe('number');
  });
});
