import packageJson from 'package-json';

export async function getLatestVersion(
  packageName: string,
  versionRange: string,
): Promise<string> {
  const result = (await packageJson(packageName, {
    version: versionRange,
  })) as unknown as { version: string };

  return result.version;
}
