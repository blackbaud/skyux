import { DeclarationReflection, ReflectionKind } from 'typedoc';

import { SkyManifestDefinition, SkyManifestPublicApi } from '../types/manifest';

import { getEntryPointsReflections } from './get-entry-points-reflections';
import { getProjects } from './get-projects';
import { getClass } from './utility/get-class';
import { getDecorator } from './utility/get-decorator';
import { getDirective } from './utility/get-directive';
import { getEnum } from './utility/get-enum';
import { getFunction } from './utility/get-function';
import { getInterface } from './utility/get-interface';
import { getPipe } from './utility/get-pipe';
import { getTypeAlias } from './utility/get-type-alias';
import { getVariable } from './utility/get-variable';

export type PackagesMap = Map<string, SkyManifestDefinition[]>;

function handleClassKind(
  child: DeclarationReflection,
  filePath: string,
): SkyManifestDefinition {
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
): SkyManifestDefinition {
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

export async function getPublicApi(): Promise<SkyManifestPublicApi> {
  const nxProjects = await getProjects();

  const packages: PackagesMap = new Map<string, SkyManifestDefinition[]>();

  for (const {
    entryPoints,
    packageName,
    projectName,
    projectRoot,
  } of nxProjects) {
    console.log(`Creating manifest for ${projectName}...`);

    const entryPointReflections = await getEntryPointsReflections({
      entryPoints,
      packageName,
      projectRoot,
    });

    for (const refl of entryPointReflections) {
      if (refl.children) {
        const items: SkyManifestDefinition[] =
          packages.get(refl.entryName) ?? [];

        for (const child of refl.children) {
          const filePath = child.sources?.[0].fileName;

          if (!filePath || filePath.endsWith('/index.ts')) {
            continue;
          }

          items.push(getManifestItem(child, filePath));
        }

        packages.set(refl.entryName, items);
      }
    }
  }

  return { packages: Object.fromEntries(packages) };
}
