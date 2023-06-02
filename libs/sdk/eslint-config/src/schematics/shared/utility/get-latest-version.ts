export async function getLatestVersion(
  packageName: string,
  versionRange: string
): Promise<string> {
  const packageJson = (await import('package-json')).default;

  const result = (await packageJson(packageName, {
    version: versionRange,
  })) as unknown as { version: string };

  return result.version;
}
