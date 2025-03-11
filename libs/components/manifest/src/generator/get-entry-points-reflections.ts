import { execSync } from 'node:child_process';
import path from 'node:path';
import {
  Application,
  type DeclarationReflection,
  type ProjectReflection,
} from 'typedoc';

import type { DeclarationReflectionWithDecorators } from './types/declaration-reflection-with-decorators';

const TYPEDOC_PLUGIN_PATH = path.join(
  __dirname,
  './plugins/typedoc-plugin-decorators.mjs',
);

type ProjectReflectionWithChildren = ProjectReflection & {
  children: ParentReflectionWithChildren[];
};

type ParentReflectionWithChildren = DeclarationReflection & {
  children: DeclarationReflectionWithDecorators[];
};

interface EntryPointReflection {
  entryName: string;
  reflection: ParentReflectionWithChildren;
}

async function getTypeDocProjectReflection(
  entryPoints: string[],
  projectRoot: string,
): Promise<ProjectReflectionWithChildren> {
  const branch = execSync('git branch --show-current', { encoding: 'utf-8' });

  const app = await Application.bootstrapWithPlugins({
    alwaysCreateEntryPointModule: true,
    compilerOptions: {
      skipLibCheck: true,
      transpileOnly: true,
      resolveJsonModule: true,
    },
    entryPoints,
    emit: 'docs',
    exclude: ['**/(fixtures|node_modules)/**', '**/*+(.fixture|.spec).ts'],
    excludeExternals: true,
    excludeInternal: false, // Include internal declarations for usage metrics.
    excludePrivate: true,
    excludeProtected: true,
    gitRemote: 'origin',
    gitRevision: branch,
    logLevel: 'Verbose',
    plugin: [TYPEDOC_PLUGIN_PATH],
    tsconfig: `${projectRoot}/tsconfig.lib.prod.json`,
  });

  const projectRefl = await app.convert();

  /* istanbul ignore if: safety check */
  if (!projectRefl || !projectRefl.children) {
    throw new Error(
      `Failed to create TypeDoc project reflection for '${projectRoot}'.`,
    );
  }

  return projectRefl as ProjectReflectionWithChildren;
}

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

  const reflections: EntryPointReflection[] = [
    {
      entryName: packageName,
      reflection: projectRefl.children[0],
    },
  ];

  const hasTestingEntryPoint = projectRefl.children.length === 2;

  if (hasTestingEntryPoint) {
    reflections.push({
      entryName: `${packageName}/testing`,
      reflection: projectRefl.children[1],
    });
  }

  return reflections;
}
