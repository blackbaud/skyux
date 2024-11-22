import { type DeclarationReflection, ReflectionKind } from 'typedoc';

import { SkyManifestParentDefinition } from '../types/base-def';
import { type SkyManifestPublicApi } from '../types/manifest';

import { getEntryPointsReflections } from './get-entry-points-reflections';
import { ProjectDefinition } from './get-projects';
import { getClass } from './utility/get-class';
import { getDecorator } from './utility/get-decorator';
import { getDirective } from './utility/get-directive';
import { getEnum } from './utility/get-enum';
import { getFunction } from './utility/get-function';
import { getInterface } from './utility/get-interface';
import { getPipe } from './utility/get-pipe';
import { getTypeAlias } from './utility/get-type-alias';
import { getVariable } from './utility/get-variable';

export type PackagesMap = Map<string, SkyManifestParentDefinition[]>;

function handleClassKind(
  child: DeclarationReflection,
  filePath: string,
): SkyManifestParentDefinition {
  const decoratorName = getDecorator(child);

  switch (decoratorName) {
    case 'Injectable': {
      return getClass(child, 'service', filePath);
    }

    case 'Component': {
      return getDirective(child, 'component', filePath);
    }

    case 'Directive': {
      return getDirective(child, 'directive', filePath);
    }

    case 'NgModule': {
      return getClass(child, 'module', filePath);
    }

    case 'Pipe': {
      return getPipe(child, filePath);
    }

    default: {
      return getClass(child, 'class', filePath);
    }
  }
}

function getManifestItem(
  child: DeclarationReflection,
  filePath: string,
): SkyManifestParentDefinition {
  switch (child.kind) {
    case ReflectionKind.Class: {
      return handleClassKind(child, filePath);
    }

    case ReflectionKind.TypeAlias: {
      return getTypeAlias(child, filePath);
    }

    case ReflectionKind.Enum: {
      return getEnum(child, filePath);
    }

    case ReflectionKind.Function: {
      return getFunction(child, filePath);
    }

    case ReflectionKind.Interface: {
      return getInterface(child, filePath);
    }

    case ReflectionKind.Variable: {
      return getVariable(child, filePath);
    }

    default: {
      throw new Error(
        `Unhandled type encountered when processing '${child.name}'.`,
      );
    }
  }
}

function sortArrayByKey<T>(arr: T[], key: keyof T): T[] {
  return arr.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue);
    }

    return 0;
  });
}

export async function getPublicApi(
  projects: ProjectDefinition[],
): Promise<SkyManifestPublicApi> {
  const packages: PackagesMap = new Map<
    string,
    SkyManifestParentDefinition[]
  >();

  for (const { entryPoints, packageName, projectRoot } of projects) {
    process.stderr.write(`Creating manifest for ${packageName}...`);

    const entryPointReflections = await getEntryPointsReflections({
      entryPoints,
      packageName,
      projectRoot,
    });

    for (const refl of entryPointReflections) {
      if (refl.children) {
        const items: SkyManifestParentDefinition[] =
          packages.get(refl.entryName) ?? [];

        for (const child of refl.children) {
          const filePath = child.sources?.[0].fileName;

          if (
            typeof filePath === 'undefined' ||
            filePath.endsWith('/index.ts')
          ) {
            continue;
          }

          items.push(getManifestItem(child, filePath));
        }

        packages.set(refl.entryName, sortArrayByKey(items, 'filePath'));
      }
    }

    process.stderr.write(' done\n');
  }

  return {
    packages: Object.fromEntries(packages),
  };
}
