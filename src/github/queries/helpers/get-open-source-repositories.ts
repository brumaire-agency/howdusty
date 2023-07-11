const openSourceLicenses = ['mit', 'apache-2.0', 'gpl-3.0', 'agpl-3.0'];

/**
 * Return open source contributions repositories.
 */
export function getOpenSourceContributionsRepositories<
  T extends RepositoriesQuery,
>(contributionsByRepositories: T[]): T[] {
  return contributionsByRepositories.filter(
    (contributionsByRepository) =>
      !contributionsByRepository.repository.isFork &&
      !contributionsByRepository.repository.isPrivate &&
      openSourceLicenses.includes(
        contributionsByRepository.repository.licenseInfo?.key,
      ),
  );
}

/**
 * Return open source repositories.
 */
export function getOpenSourceRepositories<T extends RepositoryQuery>(
  repositories: T[],
): T[] {
  return repositories.filter(
    (repository) =>
      !repository.isFork &&
      !repository.isPrivate &&
      openSourceLicenses.includes(repository.licenseInfo?.key),
  );
}

export interface RepositoriesQuery {
  repository: RepositoryQuery;
}

export interface RepositoryQuery {
  licenseInfo?: LicenseQuery;
  isFork: boolean;
  isPrivate?: boolean;
}

interface LicenseQuery {
  key: string;
}
