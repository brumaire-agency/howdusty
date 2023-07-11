import response from '../github-response.example.json';
import { UserInfoQuery } from './user-info.query';

describe('User Info Query', () => {
  const query = new UserInfoQuery();

  it('parseResult should return a User', async () => {
    const data = await query.parseResult(response);
    expect(typeof data.id).toBe('string');
    expect(typeof data.username).toBe('string');
    expect(typeof data.name).toBe('string');
    expect(typeof data.avatarUrl).toBe('string');
  });
});
