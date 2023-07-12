import { Injectable } from '@nestjs/common';
import { OnlydustApi } from './onlydust.api';
import { OnlydustQueries } from './queries/onlydust.query';
import { MetricName } from '@/metrics';
import { CollectedGrantQuery } from './queries/collected-grant/collected-grant.query';

@Injectable()
export class OnlydustService {
  private allQueries: OnlydustQueries;

  constructor(private api: OnlydustApi) {
    this.allQueries = {
      [MetricName.collectedGrant]: new CollectedGrantQuery(),
    };
  }

  async getUsers() {
    return await this.api.getUsers();
  }

  async getMetricForAll(usernames: string[], metrics: MetricName[]) {
    // Get queries that match the metrics
    const queries = Object.keys(this.allQueries)
      .filter((key) => metrics.includes(key as MetricName))
      .reduce((record, key) => [...record, this.allQueries[key]], []);

    console.log(queries);
  }
}
