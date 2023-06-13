import { MaintainedRepositoryCountMetric } from './maintained-repository-count.metric';
import response from './query-response.example.json';

describe('Maintained Repository Count Metric', () => {
  const metric = new MaintainedRepositoryCountMetric();

  it('parseResult should return a User', async () => {
    const data = await metric.parseResult(response);
    expect(typeof data.maintainedRepositoryCount).toBe('number');
  });
});
