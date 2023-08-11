import response from '../github-response.example.json';
import { githubTotalIssuesQuery } from './total-issues.query';

describe('Total Contributions Query', () => {
  const query = new githubTotalIssuesQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.githubTotalIssues).toBe('number');
  });
});
