import response from '../github-response.example.json';
import { githubIssuePullRequestRatioQuery } from './issue-pull-request-ratio.query';

describe('Issue Pull Request Ratio Query', () => {
  const query = new githubIssuePullRequestRatioQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.githubIssuePullRequestRatio).toBe('number');
  });
});
