import semver from 'semver';

export interface Version {
  isPrerelease: boolean;
  semverRange: string;
}

function getParseError(
  version: string,
  additionalErrorMessage?: string,
): Error {
  let message = `The version '${version}' is invalid or unparsable.`;

  if (additionalErrorMessage) {
    message += ` ${additionalErrorMessage}`;
  }

  return new Error(message);
}

export function parseVersion(semverRange: string): Version {
  let parsed: semver.SemVer | null;

  try {
    parsed = semver.minVersion(semverRange);
  } catch (err) {
    throw getParseError(semverRange, (err as Error).message);
  }

  if (!parsed) {
    throw getParseError(semverRange);
  }

  const isPrerelease = parsed.prerelease.length > 0;
  const rangeCharacter = semverRange.startsWith('~') ? '~' : '^';

  return {
    isPrerelease,
    semverRange: isPrerelease
      ? `${rangeCharacter}${parsed.version}`
      : rangeCharacter === '~'
        ? `${rangeCharacter}${parsed.version}`
        : `${parsed.major}`,
  };
}
