import fsPromises from 'fs/promises';
import path from 'node:path';
import { DeclarationReflection, ReflectionKind } from 'typedoc';

import { getEntryPointsReflections } from './get-entry-points-reflections';
import { getProjects } from './get-projects';
import { SkyManifestTopLevelDefinition } from './types/manifest-types';
import { getClass } from './utility/get-class';
import { getDecorator } from './utility/get-decorator';
import { getDirective } from './utility/get-directive';
import { getEnum } from './utility/get-enum';
import { getFunction } from './utility/get-function';
import { getInterface } from './utility/get-interface';
import { getPipe } from './utility/get-pipe';
import { getTypeAlias } from './utility/get-type-alias';
import { getVariable } from './utility/get-variable';

export type PackagesMap = Map<string, SkyManifestTopLevelDefinition[]>;

function handleClassKind(
  child: DeclarationReflection,
): SkyManifestTopLevelDefinition {
  const decoratorName = getDecorator(child);

  switch (decoratorName) {
    case 'Injectable': {
      return getClass(child, 'service');
    }

    case 'Component': {
      return getDirective(child, 'component');
    }

    case 'Directive': {
      return getDirective(child, 'directive');
    }

    case 'NgModule': {
      return getClass(child, 'module');
    }

    case 'Pipe': {
      return getPipe(child);
    }

    default: {
      return getClass(child, 'class');
    }
  }
}

function getManifestItem(
  child: DeclarationReflection,
): SkyManifestTopLevelDefinition {
  switch (child.kind) {
    case ReflectionKind.Class: {
      return handleClassKind(child);
    }

    case ReflectionKind.TypeAlias: {
      return getTypeAlias(child);
    }

    case ReflectionKind.Enum: {
      return getEnum(child);
    }

    case ReflectionKind.Function: {
      return getFunction(child);
    }

    case ReflectionKind.Interface: {
      return getInterface(child);
    }

    case ReflectionKind.Variable: {
      return getVariable(child);
    }

    default: {
      throw new Error(
        `Unhandled type encountered when processing '${child.name}'.`,
      );
    }
  }
}

function getSectionName(filePath: string): string | undefined {
  return filePath.split('src/lib/modules/')?.[1]?.split('/')[0];
}

function maybeSetDocumentationSection(
  filePath: string,
  projectName: string,
  docsSections: any,
  hasTestingEntryPoint: boolean,
): void {
  const sectionName = getSectionName(filePath);

  if (!sectionName) {
    console.warn(`A section name could not be determined for ${filePath}.`);
    return;
  }

  if (docsSections[sectionName] === undefined) {
    docsSections[sectionName] = {
      api: [`libs/components/${projectName}/src/lib/modules/${sectionName}/*`],
    };

    if (hasTestingEntryPoint) {
      docsSections[sectionName].testing = [
        `libs/components/${projectName}/testing/src/modules/${sectionName}/*`,
      ];
    }
  }
}

export async function getPublicApi(): Promise<PackagesMap> {
  const nxProjects = await getProjects();

  const skyuxDevConfig = JSON.parse(
    await fsPromises.readFile('.skyuxdev.json', 'utf-8'),
  );
  skyuxDevConfig.documentation = {
    sections: {},
  };

  const docsSections = skyuxDevConfig.documentation.sections;

  const packages: PackagesMap = new Map<
    string,
    SkyManifestTopLevelDefinition[]
  >();

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

    const hasTestingEntryPoint = entryPointReflections.length === 2;

    for (const refl of entryPointReflections) {
      if (refl.children) {
        const items: SkyManifestTopLevelDefinition[] =
          packages.get(refl.entryName) ?? [];

        for (const child of refl.children) {
          const filePath = child.sources?.[0].fullFileName;

          if (!filePath || filePath.endsWith('/index.ts')) {
            continue;
          }

          maybeSetDocumentationSection(
            filePath,
            projectName,
            docsSections,
            hasTestingEntryPoint,
          );

          items.push(getManifestItem(child));
        }

        packages.set(refl.entryName, items);
      }
    }
  }

  console.log('DOCS', docsSections);

  await fsPromises.writeFile(
    '.skyuxdev.json',
    JSON.stringify(skyuxDevConfig, undefined, 2),
  );

  return packages;
}
