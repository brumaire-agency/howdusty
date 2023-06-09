import { graphqlResultMock } from '../github.api.mock';
import {
  TotalContributionsData,
  TotalContributionsMetric,
} from './total-contributions.metric';

describe('TotalContributions Metric', () => {
  const metric = new TotalContributionsMetric();
  const resultMock = graphqlResultMock;

  const data: TotalContributionsData = {
    totalContributions: 56,
  };

  it('parseResult should return a User', async () => {
    expect(await metric.parseResult(resultMock)).toStrictEqual(data);
  });
});
