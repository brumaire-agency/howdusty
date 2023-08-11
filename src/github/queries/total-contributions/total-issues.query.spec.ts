import response from '../github-response.example.json';
import { TotalIssuesQuery } from './total-issues.query';

describe('Total Contributions Query', () => {
  const query = new TotalIssuesQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.totalIssues).toBe('number');
  });
});
