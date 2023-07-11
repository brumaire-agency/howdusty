import response from '../github-response.example.json';
import { TotalContributionsQuery } from './total-contributions.query';

describe('Total Contributions Query', () => {
  const query = new TotalContributionsQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.totalContributions).toBe('number');
  });
});
