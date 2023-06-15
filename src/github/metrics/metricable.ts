import { MetricName } from './metric-name';

type MetricableType = {
  [K in MetricName]: number;
};

export type Metricable = MetricableType;
