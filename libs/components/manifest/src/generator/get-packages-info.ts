import glob from 'fast-glob';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import { SkyManifestPublicApi } from '../types/manifest';

interface PackageJson {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  ['ng-update']?: {
    packageGroup: Record<string, string>;
  };
  peerDependencies?: Record<string, string>;
}

interface SkyManifestPackageInfo {
  peerDependencies: Record<string, string>;
  version: string;
}

export interface SkyManifestPackagesInfo {
  packages: Record<string, SkyManifestPackageInfo>;
}

const PACKAGES_CACHE = new Map<string, SkyManifestPackageInfo>();
let PACKAGES_UPDATE_GROUP = new Map<string, string>();
let THIS_VERSION = 'latest';

async function getAllPackages(): Promise<void> {
  if (PACKAGES_CACHE.size > 0) {
    return;
  }

  THIS_VERSION = (
    JSON.parse(
      await fsPromises.readFile(
        path.resolve(__dirname, '../../../../../package.json'),
        { encoding: 'utf-8' },
      ),
    ) as PackageJson
  ).version;

  const packageJsonFiles = await glob('libs/components/**/package.json');

  for (const packageJsonPath of packageJsonFiles) {
    const packageJson = JSON.parse(
      await fsPromises.readFile(path.normalize(packageJsonPath), {
        encoding: 'utf-8',
      }),
    ) as PackageJson;

    if (packageJson.name === '@skyux/packages') {
      const packageGroup = packageJson['ng-update']?.packageGroup;
      if (packageGroup) {
        PACKAGES_UPDATE_GROUP = new Map(Object.entries(packageGroup));
      }
    }

    PACKAGES_CACHE.set(packageJson.name, {
      peerDependencies: packageJson.peerDependencies ?? {},
      version: THIS_VERSION,
    });
  }
}

export async function getPackagesInfo(
  publicApi: SkyManifestPublicApi,
): Promise<[SkyManifestPackagesInfo, string[]]> {
  await getAllPackages();

  const info: SkyManifestPackagesInfo = {
    packages: {},
  };

  for (const packageName of Object.keys(publicApi.packages)) {
    const packageJson = PACKAGES_CACHE.get(packageName);

    if (packageJson) {
      const peerDependencies: Record<string, string> = {};

      for (const [peerDependency] of Object.entries(
        packageJson.peerDependencies,
      )) {
        let updateGroupVersion = PACKAGES_UPDATE_GROUP.get(peerDependency);

        if (updateGroupVersion && !peerDependency.startsWith('@skyux-sdk/')) {
          if (updateGroupVersion === '0.0.0-PLACEHOLDER') {
            updateGroupVersion = THIS_VERSION;
          }

          peerDependencies[peerDependency] = updateGroupVersion;
        }
      }

      info.packages[packageName] = {
        peerDependencies,
        version: packageJson.version,
      };
    }
  }

  return [info, []];
}
