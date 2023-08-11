import response from '../github-response.example.json';
import { TotalPullRequestsQuery } from './total-pull-requests.query';

describe('Total Contributions Query', () => {
  const query = new TotalPullRequestsQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.totalPullRequests).toBe('number');
  });
});
