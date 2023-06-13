import { Injectable } from '@nestjs/common';

@Injectable()
export class StandardScaler {
  /**
   * @inheritDoc
   */
  public scale(data: Record<string, number>[]): Record<string, number>[] {
    // First, collect all values for each key
    const keysToValues: Record<string, number[]> = {};
    for (const record of data) {
      for (const key in record) {
        if (!(key in keysToValues)) {
          keysToValues[key] = [];
        }
        keysToValues[key].push(record[key]);
      }
    }

    // Apply scaling to each key's values
    const keysToScaledValues: Record<string, number[]> = {};
    for (const key in keysToValues) {
      keysToScaledValues[key] = this.minMaxScaler(keysToValues[key]);
    }

    // Apply scaled values back to the data
    return data.map((record) => {
      const scaledRecord: Record<string, number> = {};
      for (const key in record) {
        scaledRecord[key] = keysToScaledValues[key].shift() as number;
      }
      return scaledRecord;
    });
  }

  private minMaxScaler(values: number[]) {
    const min = Math.min(...values);
    const max = Math.max(...values);

    return values.map((val) => (val - min) / (max - min));
  }
}
