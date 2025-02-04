import { type DeclarationReflection, ReflectionKind } from 'typedoc';

import type { SkyManifestParentDefinition } from '../types/base-def';
import type { SkyManifestPublicApi } from '../types/manifest';

import { getEntryPointsReflections } from './get-entry-points-reflections';
import { ProjectDefinition } from './get-project-definitions';
import { getClass } from './utility/get-class';
import { getDecorator } from './utility/get-decorator';
import { getDirective } from './utility/get-directive';
import { getEnum } from './utility/get-enum';
import { getFunction } from './utility/get-function';
import { getInterface } from './utility/get-interface';
import { getPipe } from './utility/get-pipe';
import { getTypeAlias } from './utility/get-type-alias';
import { getVariable } from './utility/get-variable';
import { validateDocsIds } from './validations';

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

    /* istanbul ignore next: safety check */
    default: {
      throw new Error(
        `Unhandled type encountered when processing '${reflection.name}'.`,
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

    /* istanbul ignore next: safety check */
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

        /* istanbul ignore if: safety check */
        if (!filePath || filePath.endsWith('/index.ts')) {
          continue;
        }

        items.push(getManifestItem(child, filePath));
      }

      packages.set(entryName, sortArrayByKey(items, 'filePath'));
    }
  }

  const errors = validateDocsIds(packages);

  if (errors.length > 0) {
    throw new Error(
      'Encountered the following errors when generating the manifest:\n - ' +
        errors.join('\n - '),
    );
  }

  return {
    packages: Object.fromEntries(packages),
  };
}
