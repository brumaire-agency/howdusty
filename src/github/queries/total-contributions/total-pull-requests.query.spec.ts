import response from '../github-response.example.json';
import { githubTotalPullRequestsQuery } from './total-pull-requests.query';

describe('Total Contributions Query', () => {
  const query = new githubTotalPullRequestsQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.githubTotalPullRequests).toBe('number');
  });
});
