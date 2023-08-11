import response from '../github-response.example.json';
import { githubContributedRepositoryCountQuery } from './contributed-repository-count.query';

describe('Contributed Repository Count Query', () => {
  const query = new githubContributedRepositoryCountQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.githubContributedRepositoryCount).toBe('number');
  });
});
