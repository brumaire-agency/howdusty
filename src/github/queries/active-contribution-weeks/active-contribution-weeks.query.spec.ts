import response from '../github-response.example.json';
import { ActiveContributionWeeksQuery } from './active-contribution-weeks.query';

describe('Active Contribution Weeks Query', () => {
  const query = new ActiveContributionWeeksQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.githubActiveContributionWeeks).toBe('number');
  });
});
