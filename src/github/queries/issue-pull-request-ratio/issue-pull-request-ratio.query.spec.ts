import response from '../github-response.example.json';
import { IssuePullRequestRatioQuery } from './issue-pull-request-ratio.query';

describe('Issue Pull Request Ratio Query', () => {
  const query = new IssuePullRequestRatioQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.issuePullRequestRatio).toBe('number');
  });
});
