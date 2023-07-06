import { GithubGraphResponse, Metric, MetricData } from '@/metrics/base.metric';

export class UserInfoMetric extends Metric<UserInfoMetricResult, UserInfoData> {
  /**
   * @inheritDoc
   */
  buildQuery(username: string): string {
    return `
      userInfo: user(login: "${username}") {
        id
        login
        name
        avatarUrl
      }
    `;
  }

  parseResult(result: UserInfoMetricResult): UserInfoData {
    return {
      id: result.userInfo.id,
      username: result.userInfo.login,
      name: result.userInfo.name,
      avatarUrl: result.userInfo.avatarUrl,
    };
  }
}

/**
 * Represents the object returned by the github graphql api.
 */
export interface UserInfoMetricResult extends GithubGraphResponse {
  userInfo: {
    id: string;
    login: string;
    name: string;
    avatarUrl: string;
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface UserInfoData extends MetricData {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
}
