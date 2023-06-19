import { IssuePullRequestRatioMetric } from './issue-pull-request-ratio.metric';
import response from '@/github/metrics/query-response.example.json';

describe('Issue Pull Request Ratio Metric', () => {
  const metric = new IssuePullRequestRatioMetric();

  it('parseResult should return a User', async () => {
    const data = await metric.parseResult(response);
    expect(typeof data.issuePullRequestRatio).toBe('number');
  });
});
