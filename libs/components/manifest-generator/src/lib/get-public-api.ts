import type {
  SkyManifestParentDefinition,
  SkyManifestPublicApi,
} from '@skyux/manifest-local';

import { type DeclarationReflection, ReflectionKind } from 'typedoc';

import { getEntryPointsReflections } from './get-entry-points-reflections.js';
import { ProjectDefinition } from './get-project-definitions.js';
import { getClass } from './utility/get-class.js';
import { getDecorator } from './utility/get-decorator.js';
import { getDirective } from './utility/get-directive.js';
import { getEnum } from './utility/get-enum.js';
import { getFunction } from './utility/get-function.js';
import { getInterface } from './utility/get-interface.js';
import { getPipe } from './utility/get-pipe.js';
import { getTypeAlias } from './utility/get-type-alias.js';
import { getVariable } from './utility/get-variable.js';
import { validateDocsIds } from './validations.js';

export type PackagesMap = Map<string, SkyManifestParentDefinition[]>;

function handleClassKind(
  reflection: DeclarationReflection,
  filePath: string,
): SkyManifestParentDefinition {
  const decoratorName = getDecorator(reflection);

  switch (decoratorName) {
    case 'Injectable': {
      return getClass(reflection, 'service', filePath);
    }

    case 'Component': {
      return getDirective(reflection, 'component', filePath);
    }

    case 'Directive': {
      return getDirective(reflection, 'directive', filePath);
    }

    case 'NgModule': {
      return getClass(reflection, 'module', filePath);
    }

    case 'Pipe': {
      return getPipe(reflection, filePath);
    }

    default: {
      return getClass(reflection, 'class', filePath);
    }
  }
}

function getManifestItem(
  reflection: DeclarationReflection,
  filePath: string,
): SkyManifestParentDefinition {
  switch (reflection.kind) {
    case ReflectionKind.Class: {
      return handleClassKind(reflection, filePath);
    }

    case ReflectionKind.TypeAlias: {
      return getTypeAlias(reflection, filePath);
    }

    case ReflectionKind.Enum: {
      return getEnum(reflection, filePath);
    }

    case ReflectionKind.Function: {
      return getFunction(reflection, filePath);
    }

    case ReflectionKind.Interface: {
      return getInterface(reflection, filePath);
    }

    case ReflectionKind.Variable: {
      return getVariable(reflection, filePath);
    }

    /* v8 ignore start: safety check */
    default: {
      throw new Error(
        `Unhandled type encountered when processing '${reflection.name}'.`,
      );
    }
    /* v8 ignore stop */
  }
}

function sortArrayByKey<T>(arr: T[], key: keyof T): T[] {
  return arr.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue);
      /* v8 ignore start: else branch safety check */
    }

    return 0;
    /* v8 ignore stop */
  });
}

export async function getPublicApi(
  projects: ProjectDefinition[],
): Promise<[SkyManifestPublicApi, string[]]> {
  const packages: PackagesMap = new Map<
    string,
    SkyManifestParentDefinition[]
  >();

  for (const { entryPoints, packageName, projectRoot } of projects) {
    console.log(`Creating manifest for "${projectRoot}"...`);

    const entryPointReflections = await getEntryPointsReflections({
      entryPoints,
      packageName,
      projectRoot,
    });

    for (const { entryName, reflection } of entryPointReflections) {
      const items = packages.get(entryName) ?? [];

      for (const child of reflection.children) {
        const filePath = child.sources?.[0].fullFileName
          .replace(process.cwd(), '')
          .slice(1);

        /* v8 ignore start: safety check */
        if (!filePath || filePath.endsWith('/index.ts')) {
          continue;
        }
        /* v8 ignore stop */

        items.push(getManifestItem(child, filePath));
      }

      packages.set(entryName, sortArrayByKey(items, 'filePath'));
    }
  }

  const errors = validateDocsIds(packages);

  return [
    {
      packages: Object.fromEntries(packages),
    },
    errors,
  ];
}
