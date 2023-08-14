import response from '../github-response.example.json';
import { ContributedRepositoryCountQuery } from './contributed-repository-count.query';

describe('Contributed Repository Count Query', () => {
  const query = new ContributedRepositoryCountQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.githubContributedRepositoryCount).toBe('number');
  });
});
