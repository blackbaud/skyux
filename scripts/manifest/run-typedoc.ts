/* eslint-disable complexity, max-depth */
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import {
  Application,
  DeclarationReflection,
  ProjectReflection,
  ReflectionKind,
} from 'typedoc';

import { DeclarationReflectionWithDecorators } from './declaration-reflection-with-decorators';
import { getProjects } from './get-projects';
import { SkyManifestPackageSection } from './types';
import { getClass } from './utility/get-class';
import { getComment } from './utility/get-comment';
import { getDecorator } from './utility/get-decorator';
import { getDirective } from './utility/get-directive';
import { getEnum } from './utility/get-enum';
import { getFunction } from './utility/get-function';
import { getInterface } from './utility/get-interface';
import { getPipe } from './utility/get-pipe';
import { getTypeAlias } from './utility/get-type-alias';
import { getVariable } from './utility/get-variable';
import { sortMapByKey, toObject } from './utility/maps';

const TYPEDOC_PLUGIN_PATH = path.join(__dirname, './typedoc-plugin.mjs');

type PackagesMap = Map<string, PackageSectionsMap>;
type PackageSectionsMap = Map<string, SkyManifestPackageSection>;

async function getTypeDocProjectReflection(
  entryPoints: string[],
  projectRoot: string,
): Promise<ProjectReflection> {
  const app = await Application.bootstrapWithPlugins({
    entryPoints,
    emit: 'docs',
    excludeExternals: true,
    excludeInternal: true,
    excludePrivate: true,
    excludeProtected: true,
    logLevel: 'Error',
    plugin: [TYPEDOC_PLUGIN_PATH],
    tsconfig: `${projectRoot}/tsconfig.lib.prod.json`,
    exclude: [
      `!**/${projectRoot}/**`,
      '**/(fixtures|node_modules)/**',
      '**/*+(.fixture|.spec).ts',
    ],
    externalPattern: [`!**/${projectRoot}/**`],
  });

  const projectRefl = await app.convert();

  if (!projectRefl) {
    throw new Error(
      `Failed to create TypeDoc project reflection for '${projectRoot}'.`,
    );
  }

  return projectRefl;
}

/**
 * If multiple entry points are provided, TypeDoc creates an array of project
 * reflections. If it's just one, TypeDoc skips the array, and exports the
 * children as one object. This function always returns an array.
 */
function getEntryPointReflections({
  entryPoints,
  packageName,
  projectRefl,
}: {
  entryPoints: string[];
  packageName: string;
  projectRefl: ProjectReflection;
}): { entryName: string; children?: DeclarationReflectionWithDecorators[] }[] {
  const reflections: {
    entryName: string;
    children?: DeclarationReflectionWithDecorators[];
  }[] = [];

  const hasTestingEntryPoint = fs.existsSync(path.normalize(entryPoints[1]));

  if (hasTestingEntryPoint) {
    reflections.push(
      {
        entryName: packageName,
        children: projectRefl.children?.[0].children,
      },
      {
        entryName: `${packageName}/testing`,
        children: projectRefl.children?.[1].children,
      },
    );
  } else {
    reflections.push({
      entryName: packageName,
      children: projectRefl.children,
    });
  }

  return reflections;
}

async function writeJsonFiles(packagesMap: PackagesMap): Promise<void> {
  await fsPromises.writeFile(
    `manifests/public-api.json`,
    JSON.stringify(toObject(sortMapByKey(packagesMap)), undefined, 2),
  );
}

function getSectionName(decl: DeclarationReflection): string {
  const { docsSection } = getComment(
    // closures save their comments on the signature object.
    decl.comment ?? decl.signatures?.[0]?.comment,
  );

  if (!docsSection) {
    throw new Error(
      `The top-level type '${decl.name}' is listed in the public API but did ` +
        'not provide a value for @docsSection in its JSDoc comment.',
    );
  }

  return docsSection;
}

async function runTypeDoc(): Promise<void> {
  const nxProjects = await getProjects();

  if (fs.existsSync('manifests')) {
    await fsPromises.rm('manifests', { recursive: true });
  }

  await fsPromises.mkdir('manifests');

  const packages: PackagesMap = new Map<string, PackageSectionsMap>();

  for (const {
    entryPoints,
    packageName,
    projectName,
    projectRoot,
  } of nxProjects) {
    const projectRefl = await getTypeDocProjectReflection(
      entryPoints,
      projectRoot,
    );

    console.log(`Creating manifest for ${projectName}...`);

    const entryPointReflections = getEntryPointReflections({
      entryPoints,
      packageName,
      projectRefl,
    });

    for (const refl of entryPointReflections) {
      if (refl.children) {
        const sections: PackageSectionsMap =
          packages.get(refl.entryName) ??
          new Map<string, SkyManifestPackageSection>();

        for (const child of refl.children) {
          const filePath = child.sources?.[0].fullFileName;

          if (!filePath || filePath.endsWith('/index.ts')) {
            continue;
          }

          const sectionName = getSectionName(child);
          const section: SkyManifestPackageSection = sections.get(
            sectionName,
          ) ?? {
            classes: [],
            components: [],
            directives: [],
            enumerations: [],
            functions: [],
            interfaces: [],
            modules: [],
            pipes: [],
            services: [],
            typeAliases: [],
            variables: [],
          };

          switch (child.kind) {
            case ReflectionKind.Class: {
              const decoratorName = getDecorator(child);

              switch (decoratorName) {
                case 'Injectable': {
                  section.services.push(getClass(child, sectionName));
                  break;
                }

                case 'Component':
                case 'Directive': {
                  section.directives.push(getDirective(child, sectionName));
                  break;
                }

                case 'NgModule': {
                  section.modules.push(getClass(child, sectionName));
                  break;
                }

                case 'Pipe': {
                  section.pipes.push(getPipe(child, sectionName));
                  break;
                }

                default: {
                  section.classes.push(getClass(child, sectionName));
                  break;
                }
              }

              break;
            }

            case ReflectionKind.TypeAlias: {
              section.typeAliases.push(getTypeAlias(child, sectionName));
              break;
            }

            case ReflectionKind.Enum: {
              section.enumerations.push(getEnum(child, sectionName));
              break;
            }

            case ReflectionKind.Function: {
              section.functions.push(getFunction(child, sectionName));
              break;
            }

            case ReflectionKind.Interface: {
              section.interfaces.push(getInterface(child, sectionName));
              break;
            }

            case ReflectionKind.Variable: {
              section.variables.push(getVariable(child, sectionName));
              break;
            }

            default: {
              throw new Error(
                `Unhandled type encountered when processing '${child.name}'.`,
              );
            }
          }

          sections.set(sectionName, section);
        }

        packages.set(refl.entryName, sortMapByKey(sections));
      }
    }
  }

  await writeJsonFiles(packages);
}

try {
  runTypeDoc();
} catch (err) {
  console.error(err.message);
}

/**
 * TODO:
 * - Uniform structure to testing directory.
 * - Where to put JSON files, and where to put the generator?
 * - Unit tests.
 * - Simplify shape? Allow undefined values?
 * 1. Run typedoc to determine the public API.  @skyux/metadata/public-api.json
 * 2. Filter deprecated items.                  @skyux/metadata/deprecated.json
 * 3. Filter template items.                    @skyux/metadata/template-features.json
 */
