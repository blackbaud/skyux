/* eslint-disable max-depth */
/* eslint-disable complexity */
import { execSync } from 'node:child_process';
import {
  Application,
  Context,
  Converter,
  type DeclarationReflection,
  type ProjectReflection,
  ReflectionKind,
  TypeScript as ts,
} from 'typedoc';

import type {
  DeclarationReflectionDecorator,
  DeclarationReflectionWithDecorators,
} from './types/declaration-reflection-with-decorators.js';

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

function applyDecoratorMetadata(
  context: Context,
  reflection: DeclarationReflection,
): void {
  const kind = ReflectionKind[reflection.kind];
  const kindsWithDecorators = [
    'Accessor',
    'Class',
    'Method',
    'Module',
    'Property',
  ];

  if (!kindsWithDecorators.includes(kind)) {
    return;
  }

  const symbol = context.getSymbolFromReflection(reflection);
  const declaration = symbol?.valueDeclaration as undefined | ts.HasModifiers;

  if (!declaration || !declaration.modifiers) {
    return;
  }

  const modifiers = declaration.modifiers as unknown as ts.Decorator[];
  const decorators: DeclarationReflectionDecorator[] = [];

  for (const modifier of modifiers) {
    const callExpression = modifier.expression as undefined | ts.CallExpression;
    const identifier = callExpression?.expression as undefined | ts.Identifier;

    if (identifier) {
      const decoratorName = identifier.escapedText as string;

      if (
        ![
          'Component',
          'Directive',
          'Injectable',
          'Input',
          'NgModule',
          'Output',
          'Pipe',
        ].includes(decoratorName)
      ) {
        continue;
      }

      const decorator: DeclarationReflectionDecorator = {
        name: decoratorName,
      };

      const args = callExpression?.arguments[0] as any;

      if (args) {
        switch (decorator.name) {
          case 'Component':
          case 'Directive':
            decorator.arguments = {
              selector:
                args.symbol.members.get('selector')?.valueDeclaration
                  .initializer.text ?? '',
            };

            break;

          case 'Pipe':
            decorator.arguments = {
              name: args.symbol.members.get('name').valueDeclaration.initializer
                .text,
            };
            break;

          case 'Input': {
            const alias =
              args.text ??
              args.symbol?.members.get('alias')?.valueDeclaration.initializer
                .text;

            if (alias) {
              decorator.arguments = {
                bindingPropertyName: alias,
              };
            }

            break;
          }
        }
      }

      decorators.push(decorator);
    }
  }

  (reflection as DeclarationReflectionWithDecorators).decorators = decorators;
}

async function getTypeDocProjectReflection(
  entryPoints: string[],
  projectRoot: string,
): Promise<ProjectReflectionWithChildren> {
  const branch = execSync('git branch --show-current', { encoding: 'utf-8' });

  const app = await Application.bootstrapWithPlugins({
    alwaysCreateEntryPointModule: true,
    entryPoints,
    emit: 'docs',
    excludeExternals: true,
    excludeInternal: false, // Include internal declarations for usage metrics.
    excludePrivate: true,
    excludeProtected: true,
    gitRemote: 'origin',
    gitRevision: branch,
    logLevel: 'Error',
    tsconfig: `${projectRoot}/tsconfig.lib.prod.json`,
    compilerOptions: {
      skipLibCheck: true,
      transpileOnly: true,
      resolveJsonModule: true,
    },
    exclude: ['**/(fixtures|node_modules)/**', '**/*+(.fixture|.spec).ts'],
  });

  app.converter.on(Converter.EVENT_CREATE_DECLARATION, applyDecoratorMetadata);

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
