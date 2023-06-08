import { GithubGraphResponse, Metric, MetricData } from './base.metric';

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
      id: result.data.userInfo.id,
      username: result.data.userInfo.login,
      name: result.data.userInfo.name,
      avatarUrl: result.data.userInfo.avatarUrl,
    };
  }
}

/**
 * blabla 1
 */
interface UserInfoMetricResult extends GithubGraphResponse {
  data: {
    userInfo: {
      id: string;
      login: string;
      name: string;
      avatarUrl: string;
    };
  };
}

/**
 * blabla 2
 */
interface UserInfoData extends MetricData {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
}
