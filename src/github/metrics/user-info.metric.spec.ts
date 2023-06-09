import { UserInfoMetric } from './user-info.metric';
import response from './query-response.example.json';

describe('UserInfo Metric', () => {
  const metric = new UserInfoMetric();

  it('parseResult should return a User', async () => {
    const data = await metric.parseResult(response);
    expect(typeof data.id).toBe('string');
    expect(typeof data.username).toBe('string');
    expect(typeof data.name).toBe('string');
    expect(typeof data.avatarUrl).toBe('string');
  });
});
