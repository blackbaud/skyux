import { getCommandOutput } from './spawn';

async function getVersions(packageName: string) {
  const versions = await getCommandOutput('npm', [
    'view',
    packageName,
    'versions',
    '--json',
  ]);

  return JSON.parse(versions);
}

/**
 * Checks if a given version exists for an NPM package.
 */
export async function checkVersionExists(packageName: string, version: string) {
  const versions = await getVersions(packageName);
  return versions.includes(version);
}

export async function getDistTags(packageName: string) {
  const distTags = await getCommandOutput('npm', [
    'view',
    packageName,
    'dist-tags',
    '--json',
  ]);

  return JSON.parse(distTags);
}
