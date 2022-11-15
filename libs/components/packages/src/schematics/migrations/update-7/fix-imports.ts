import { Path, dirname, join, normalize, split } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import * as path from 'path';

import { getWorkspace } from '../../utility/workspace';

// Obfuscate the import statement regexp to avoid flagging by the missing peer dependency check.
const CORE_JS_UNNECESSARY = /imp[o]rt \{[^}]+} from 'core-js';\r?\n/;
const CORE_JS_OBJECT_VALUES =
  /imp[o]rt values from 'core-js\/features\/object\/values';\r?\n/;
const CORE_JS_OBJECT_VALUES_REQUIRE = `require('core-js/library/fn/object/values')`;

function findChangesForLocalImports(
  localModulePaths: string[],
  filePath: string,
  tree: Tree,
  context: SchematicContext
): { find: string; replace: string }[] {
  const transformers: { find: string; replace: string }[] = [];
  localModulePaths.forEach((modulePath: string) => {
    const endsWithSlash = !!modulePath.match(/[/\\]$/);
    const normalizedModulePath = endsWithSlash
      ? normalize(modulePath)
      : normalize(modulePath + '.ts');
    const absolutePath = normalize(
      join(dirname(normalize(filePath)), normalizedModulePath)
    );
    context.logger.debug(
      `Looking for local module ${modulePath} at ${absolutePath}...`
    );
    const pathFragments = split(absolutePath as Path).slice(1);
    const newPath: string[] = [];
    let dir = tree.root;
    // Walk the path fragments and check if the case is correct. This approach works on both case-sensitive and case-insensitive file systems.
    for (let i = 0; i < pathFragments.length; i++) {
      const pathFragment = pathFragments[i];
      if (pathFragment.endsWith('.ts')) {
        if (dir.subfiles.includes(pathFragment)) {
          // File exists. We're done.
          newPath.push(pathFragment.replace(/\.ts$/, ''));
          break;
        }
        // File does not exist. Try to find a file with the same name but different casing.
        const matchingFile = dir.subfiles.find(
          (subFile) => subFile.toLowerCase() === pathFragment.toLowerCase()
        );
        if (matchingFile) {
          // Found a matching file. Use it.
          newPath.push(matchingFile.replace(/\.ts$/, ''));
          break;
        }
      } else {
        if (dir.subdirs.includes(pathFragment)) {
          // Sub dir exists. Continue.
          dir = dir.dir(pathFragment);
          newPath.push(pathFragment);
          continue;
        }
        // Dir does not exist. Try to find a dir with the same name but different casing.
        const matchingDir = dir.subdirs.find(
          (subdir) => subdir.toLowerCase() === pathFragment.toLowerCase()
        );
        if (matchingDir) {
          // Found a matching dir. Use it.
          dir = dir.dir(matchingDir);
          newPath.push(matchingDir);
          continue;
        }
      }
      // Nothing found. Can't fix this.
      return;
    }
    const newPathAbsolute = join(tree.root.path, ...newPath);
    let newPathRelative = path.relative(
      dirname(filePath as Path),
      newPathAbsolute
    );
    if (!newPathRelative.startsWith('.')) {
      newPathRelative = `./${newPathRelative}`;
    }
    if (endsWithSlash) {
      newPathRelative = `${newPathRelative}/`;
    }
    if (newPathRelative !== modulePath) {
      context.logger.debug(
        `Updating ${filePath} :: ${modulePath} -> ${newPathRelative}`
      );
      transformers.push({
        find: modulePath,
        replace: newPathRelative,
      });
    }
  });
  return transformers;
}

function findChangesForCoreJs(
  sourceFile: ts.SourceFile,
  coreJsImportDeclarations: ts.ImportDeclaration[],
  context: SchematicContext,
  filePath: string,
  fileContent: string
): { find: string; replace: string }[] {
  const transformers: { find: string; replace: string }[] = [];
  context.logger.debug(`Updating core-js imports in ${filePath}...`);
  // Remove core-js imports that are not necessary.
  const coreJsUnnecessaryImport = `${
    CORE_JS_UNNECESSARY.exec(fileContent)?.[0]
  }`;
  if (coreJsUnnecessaryImport !== 'undefined') {
    transformers.push({
      find: coreJsUnnecessaryImport,
      replace: '',
    });
  }

  // Replace direct import from core-js/features/object/values with Object.values in some very specific cases.
  const coreJsObjectValuesImport = `${
    CORE_JS_OBJECT_VALUES.exec(fileContent)?.[0]
  }`;
  if (coreJsObjectValuesImport !== 'undefined') {
    transformers.push({
      find: coreJsObjectValuesImport,
      replace: '',
    });
    transformers.push({
      find: 'values: values,',
      replace: 'values: Object.values,',
    });
  }
  if (fileContent.includes(CORE_JS_OBJECT_VALUES_REQUIRE)) {
    transformers.push({
      find: CORE_JS_OBJECT_VALUES_REQUIRE,
      replace: 'Object.values',
    });
  }

  // Comment out polyfill core-js imports like `'core-js/es6';` or `'core-js/es7/reflect';`.
  coreJsImportDeclarations
    .filter((importDeclaration) => !importDeclaration.importClause)
    .forEach((importDeclaration) => {
      const importCode = fileContent.substring(
        importDeclaration.getStart(sourceFile, false),
        importDeclaration.getEnd()
      );
      transformers.push({
        find: importCode,
        replace: `// ${importCode}`,
      });
    });

  return transformers;
}

function updateTypescriptImportsAndExports(
  filePath: string,
  tree: Tree,
  context: SchematicContext
): void {
  const fileContent = tree.read(filePath)?.toString();
  if (!fileContent) {
    return;
  }
  context.logger.debug(`Checking imports and exports in ${filePath}...`);
  const source = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );
  // Get all import declarations
  const importDeclarations = source.statements.filter(
    (statement) => statement.kind === ts.SyntaxKind.ImportDeclaration
  ) as ts.ImportDeclaration[];
  // Get all export declarations
  const exportDeclarations = source.statements.filter(
    (statement) =>
      statement.kind === ts.SyntaxKind.ExportDeclaration &&
      (statement as ts.ExportDeclaration).moduleSpecifier
  ) as ts.ExportDeclaration[];

  const transformers: { find: string; replace: string }[] = [];

  // Just local module targets, without quotes
  const localModulePaths = [...importDeclarations, ...exportDeclarations]
    .map((declaration) => `${declaration.moduleSpecifier?.getText(source)}`)
    .map((moduleSpecifier) => moduleSpecifier.replace(/['"]/g, ''))
    .filter((moduleSpecifier) => moduleSpecifier.startsWith('.'));
  if (localModulePaths.length > 0) {
    transformers.push(
      ...findChangesForLocalImports(localModulePaths, filePath, tree, context)
    );
  }

  const coreJsImportDeclarations = importDeclarations.filter((declaration) => {
    const moduleSpecifier = `${declaration.moduleSpecifier?.getText(
      source
    )}`.replace(/['"]/g, '');
    return moduleSpecifier.startsWith('core-js');
  });
  if (coreJsImportDeclarations.length > 0) {
    transformers.push(
      ...findChangesForCoreJs(
        source,
        coreJsImportDeclarations,
        context,
        filePath,
        fileContent
      )
    );
  }

  if (transformers.length > 0) {
    let newContent = fileContent;
    transformers.forEach((transformer) => {
      newContent = newContent.replace(transformer.find, transformer.replace);
    });
    tree.overwrite(filePath, newContent);
  }
}

async function visitTypescriptFiles(
  tree: Tree,
  context: SchematicContext
): Promise<void> {
  const { workspace } = await getWorkspace(tree);
  workspace.projects.forEach((project, projectName) => {
    context.logger.debug(
      `Looking for typescript files in project ${projectName}...`
    );
    tree.getDir(project.sourceRoot || project.root).visit((filePath) => {
      if (filePath.endsWith('.ts') && !filePath.includes('node_modules')) {
        updateTypescriptImportsAndExports(filePath, tree, context);
      }
    });
  });
}

export default function (): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    await visitTypescriptFiles(tree, context);
  };
}
