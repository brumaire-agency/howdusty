import response from '../github-response.example.json';
import { githubActiveContributionWeeksQuery } from './active-contribution-weeks.query';

describe('Active Contribution Weeks Query', () => {
  const query = new githubActiveContributionWeeksQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.githubActiveContributionWeeks).toBe('number');
  });
});
