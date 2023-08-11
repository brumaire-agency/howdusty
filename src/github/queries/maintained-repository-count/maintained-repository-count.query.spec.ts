import response from '../github-response.example.json';
import { githubMaintainedRepositoryCountQuery } from './maintained-repository-count.query';

describe('Maintained Repository Count Query', () => {
  const query = new githubMaintainedRepositoryCountQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.githubMaintainedRepositoryCount).toBe('number');
  });
});
