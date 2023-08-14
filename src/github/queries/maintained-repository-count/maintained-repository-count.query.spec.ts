import response from '../github-response.example.json';
import { MaintainedRepositoryCountQuery } from './maintained-repository-count.query';

describe('Maintained Repository Count Query', () => {
  const query = new MaintainedRepositoryCountQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.githubMaintainedRepositoryCount).toBe('number');
  });
});
