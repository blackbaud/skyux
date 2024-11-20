import fsPromises from 'fs/promises';
import { glob } from 'glob';
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

function sortObjectByKeys<T extends Record<string, unknown>>(obj: T): T {
  return Object.keys(obj)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {}) as T;
}

function getSectionName(filePath: string): string | undefined {
  return filePath.split('src/lib/modules/')?.[1]?.split('/')[0];
}

function maybeSetDocumentationSection(
  filePath: string,
  packageName: string,
  projectName: string,
  docsSections: any,
): void {
  if (filePath.includes('/testing/')) {
    return;
  }

  const sectionName = getSectionName(filePath);

  if (!sectionName) {
    console.warn(`A section name could not be determined for ${filePath}.`);
    return;
  }

  if (docsSections[sectionName] === undefined) {
    const apiGlob = `libs/components/${projectName}/src/lib/modules/${sectionName}/*`;
    const codeExamplesGlob = `apps/code-examples/src/app/code-examples/${projectName}/${sectionName}/*`;

    if (glob.sync(apiGlob).length > 0) {
      docsSections[sectionName] = {
        packageName,
        title: sectionName,
        api: [apiGlob],
      };
    } else {
      throw new Error(`API files not found for ${projectName}/${sectionName}!`);
    }

    if (glob.sync(codeExamplesGlob).length > 0) {
      docsSections[sectionName].codeExamples = [codeExamplesGlob];
    } else {
      console.error(
        ` ! No code example files found for ${projectName}/${sectionName}`,
      );
    }

    const testingGlob = `libs/components/${projectName}/testing/src/modules/${sectionName}/*`;

    if (glob.sync(testingGlob).length > 0) {
      docsSections[sectionName].testing = [testingGlob];
    } else {
      console.error(
        ` ! No testing files found for ${projectName}/${sectionName}`,
      );
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
            packageName,
            projectName,
            docsSections,
          );

          items.push(getManifestItem(child));
        }

        packages.set(refl.entryName, items);
      }
    }
  }

  skyuxDevConfig.documentation.sections = sortObjectByKeys(docsSections);

  console.log('DOCS', skyuxDevConfig.documentation.sections);

  await fsPromises.writeFile(
    '.skyuxdev.json',
    JSON.stringify(skyuxDevConfig, undefined, 2),
  );

  return packages;
}
