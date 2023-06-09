import { graphqlResultMock } from '../github.api.mock';
import { UserInfoData, UserInfoMetric } from './user-info.metric';

describe('UserInfo Metric', () => {
  const metric = new UserInfoMetric();
  const resultMock = graphqlResultMock;

  const data: UserInfoData = {
    id: 'githubusernameid',
    username: 'githubusername',
    name: 'Github User Name',
    avatarUrl: 'https://githubusername.com',
  };

  it('parseResult should return a User', async () => {
    expect(await metric.parseResult(resultMock)).toStrictEqual(data);
  });
});
