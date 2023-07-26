export class MetricsRepositoryMock {
  contributorsMetrics: any[] = [];

  find() {
    return Promise.resolve(this.contributorsMetrics);
  }

  save<T>(contributor: T): Promise<T> {
    const contributors = Array.isArray(contributor)
      ? contributor
      : [contributor];

    for (const element of contributors) {
      const contributorToUpdate = this.contributorsMetrics.findIndex(
        (item) => item.id === element.id,
      );
      if (contributorToUpdate >= 0) {
        // Update
        this.contributorsMetrics[contributorToUpdate] = {
          ...this.contributorsMetrics[contributorToUpdate],
          ...element,
        };
      } else {
        // Create
        this.contributorsMetrics = [...this.contributorsMetrics, element];
      }
    }

    return Promise.resolve(contributor);
  }
}
