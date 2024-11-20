import fs from 'node:fs';
import path from 'node:path';
import { Application, ProjectReflection } from 'typedoc';

import { DeclarationReflectionWithDecorators } from './types/declaration-reflection-with-decorators';

const TYPEDOC_PLUGIN_PATH = path.join(__dirname, './typedoc-plugin.mjs');

async function getTypeDocProjectReflection(
  entryPoints: string[],
  projectRoot: string,
): Promise<ProjectReflection> {
  const app = await Application.bootstrapWithPlugins({
    entryPoints,
    emit: 'docs',
    excludeExternals: true,
    excludeInternal: false, // intentional!
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

interface EntryPointReflection {
  entryName: string;
  children?: DeclarationReflectionWithDecorators[];
}

/**
 * If multiple entry points are provided, TypeDoc creates an array of project
 * reflections. If it's just one, TypeDoc skips the array, and exports the
 * children as one object. This function always returns an array.
 */
export async function getEntryPointsReflections({
  entryPoints,
  packageName,
  projectRoot,
}: {
  entryPoints: string[];
  packageName: string;
  projectRoot: string;
}): Promise<EntryPointReflection[]> {
  const projectRefl = await getTypeDocProjectReflection(
    entryPoints,
    projectRoot,
  );

  const reflections: EntryPointReflection[] = [];

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
