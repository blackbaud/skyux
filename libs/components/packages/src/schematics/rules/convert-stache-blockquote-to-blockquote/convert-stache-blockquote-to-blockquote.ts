import { Rule, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import { getEOL } from '@schematics/angular/utility/eol';
import ts from 'typescript';

import { swapPackageDependency } from '../../utility/dependencies';
import { logOnce } from '../../utility/log-once';
import { getElementsByTagName, parseTemplate } from '../../utility/template';
import {
  addSymbolToClassMetadata,
  getInlineTemplates,
  getLocalImportName,
  isImportedFromPackage,
  isSymbolInClassMetadataFieldArray,
  parseSourceFile,
} from '../../utility/typescript/ng-ast';
import {
  isDecoratorMetadataArray,
  removeClassReference,
} from '../../utility/typescript/remove-class-reference';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';

const STACHE_PACKAGE = '@blackbaud/skyux-lib-stache';
const STACHE_BLOCKQUOTE_MODULE = 'StacheBlockquoteModule';
// Stache's aggregate module, which re-exports `StacheBlockquoteModule`.
const STACHE_MODULE = 'StacheModule';
const STACHE_CLASS_NAMES = [STACHE_BLOCKQUOTE_MODULE, STACHE_MODULE];
const STACHE_TAG = 'stache-blockquote';
const SKYUX_PACKAGE = '@skyux/layout';
const SKYUX_CLASS_NAME = 'SkyBlockquote';
const SKYUX_TAG = 'sky-blockquote';

const METADATA_FIELDS = ['imports', 'exports'];
const LEFTOVER_REFERENCE_EXTENSIONS = [
  '.ts',
  '.html',
  '.css',
  '.scss',
  '.sass',
  '.less',
];

function isStacheSpecifier(specifier: ts.Expression | undefined): boolean {
  return (
    !!specifier &&
    ts.isStringLiteral(specifier) &&
    specifier.text === STACHE_PACKAGE
  );
}

function listsIdentifier(
  array: ts.ArrayLiteralExpression,
  name: string,
): boolean {
  return array.elements.some(
    (element) => ts.isIdentifier(element) && element.text === name,
  );
}

function getSkyBlockquoteName(source: ts.SourceFile): string {
  return (
    getLocalImportName(source, SKYUX_CLASS_NAME, SKYUX_PACKAGE) ??
    SKYUX_CLASS_NAME
  );
}

/**
 * True if the file reaches Stache's blockquote through an aliased import, a
 * namespace import or a re-export. `swapImportedClass` only rewrites plain
 * named imports, and every `<stache-blockquote>` in the project is renamed, so
 * a blockquote provided this way would be left without `SkyBlockquote`.
 */
function hasUnconvertibleStacheUsage(source: ts.SourceFile): boolean {
  const isAliased = STACHE_CLASS_NAMES.some((className) => {
    const localName = getLocalImportName(source, className, STACHE_PACKAGE);

    return localName !== undefined && localName !== className;
  });

  if (isAliased) {
    return true;
  }

  return source.statements.some((statement) => {
    if (ts.isExportDeclaration(statement)) {
      const exportClause = statement.exportClause;

      return (
        isStacheSpecifier(statement.moduleSpecifier) &&
        (!exportClause ||
          !ts.isNamedExports(exportClause) ||
          exportClause.elements.some((element) =>
            STACHE_CLASS_NAMES.includes(
              (element.propertyName ?? element.name).text,
            ),
          ))
      );
    }

    if (
      !ts.isImportDeclaration(statement) ||
      !isStacheSpecifier(statement.moduleSpecifier)
    ) {
      return false;
    }

    const namedBindings = statement.importClause?.namedBindings;

    if (!namedBindings || !ts.isNamespaceImport(namedBindings)) {
      return false;
    }

    return findNodes(source, ts.isPropertyAccessExpression).some(
      (node) =>
        node.expression.getText() === namedBindings.name.text &&
        STACHE_CLASS_NAMES.includes(node.name.text),
    );
  });
}

/**
 * Stache's aggregate module stays, since it provides Stache's other
 * components, so `SkyBlockquote` is listed right after it wherever it's listed.
 */
function addSkyBlockquoteAfterStacheModule(tree: Tree, filePath: string): void {
  const source = parseSourceFile(tree, filePath);

  if (!isImportedFromPackage(source, STACHE_MODULE, STACHE_PACKAGE)) {
    return;
  }

  const skyBlockquoteName = getSkyBlockquoteName(source);
  const references = findNodes(source, ts.SyntaxKind.Identifier).filter(
    (node) =>
      ts.isIdentifier(node) &&
      node.text === STACHE_MODULE &&
      ts.isArrayLiteralExpression(node.parent) &&
      !listsIdentifier(node.parent, skyBlockquoteName),
  );

  if (references.length === 0) {
    return;
  }

  const eol = getEOL(source.text);
  const recorder = tree.beginUpdate(filePath);

  for (const reference of references) {
    const start = reference.getStart();
    const lineStart =
      source.getLineStarts()[source.getLineAndCharacterOfPosition(start).line];
    const indent = /^\s*/.exec(source.text.slice(lineStart, start))?.[0];
    const separator = reference.parent.getText().includes('\n')
      ? `,${eol}${indent}`
      : ', ';

    recorder.insertRight(
      reference.getEnd(),
      `${separator}${skyBlockquoteName}`,
    );
  }

  if (!isImportedFromPackage(source, SKYUX_CLASS_NAME, SKYUX_PACKAGE)) {
    applyToUpdateRecorder(recorder, [
      insertImport(source, filePath, SKYUX_CLASS_NAME, SKYUX_PACKAGE),
    ]);
  }

  tree.commitUpdate(recorder);
}

/**
 * True if `reference` sits in a decorator or `TestBed` metadata array that
 * already lists `skyBlockquoteName`. Swapping it there would list
 * `SkyBlockquote` twice, so `removeClassReference` removes it instead. Other
 * arrays are swapped, since `removeClassReference` leaves them alone.
 */
function isInMetadataArrayWith(
  reference: ts.Identifier,
  skyBlockquoteName: string,
): boolean {
  const array = reference.parent;

  return (
    ts.isArrayLiteralExpression(array) &&
    isDecoratorMetadataArray(array, METADATA_FIELDS) &&
    listsIdentifier(array, skyBlockquoteName)
  );
}

function swapStacheBlockquoteModule(tree: Tree, filePath: string): void {
  const source = parseSourceFile(tree, filePath);

  if (
    !isImportedFromPackage(source, STACHE_BLOCKQUOTE_MODULE, STACHE_PACKAGE)
  ) {
    return;
  }

  const skyBlockquoteName = getSkyBlockquoteName(source);

  const swapRecorder = tree.beginUpdate(filePath);
  swapImportedClass(swapRecorder, filePath, source, [
    {
      classNames: { [STACHE_BLOCKQUOTE_MODULE]: SKYUX_CLASS_NAME },
      moduleName: { old: STACHE_PACKAGE, new: SKYUX_PACKAGE },
      filter: (reference): boolean =>
        !isInMetadataArrayWith(reference, skyBlockquoteName),
      localNames: { [SKYUX_CLASS_NAME]: skyBlockquoteName },
    },
  ]);
  tree.commitUpdate(swapRecorder);

  const swappedSource = parseSourceFile(tree, filePath);

  if (
    isImportedFromPackage(
      swappedSource,
      STACHE_BLOCKQUOTE_MODULE,
      STACHE_PACKAGE,
    )
  ) {
    const removeRecorder = tree.beginUpdate(filePath);
    removeClassReference(
      removeRecorder,
      swappedSource,
      STACHE_BLOCKQUOTE_MODULE,
      STACHE_PACKAGE,
      METADATA_FIELDS,
    );
    tree.commitUpdate(removeRecorder);
  }
}

/**
 * An NgModule can export a Stache module it doesn't import, but Angular only
 * lets it export a standalone component it also imports.
 */
function importExportedSkyBlockquote(tree: Tree, filePath: string): void {
  const source = parseSourceFile(tree, filePath);
  const skyBlockquoteName = getSkyBlockquoteName(source);
  const changes = addSymbolToClassMetadata(
    source,
    'NgModule',
    filePath,
    'imports',
    skyBlockquoteName,
    null,
    (metadata) =>
      isSymbolInClassMetadataFieldArray(metadata, 'exports', skyBlockquoteName),
  );

  if (changes.length > 0) {
    const recorder = tree.beginUpdate(filePath);
    applyToUpdateRecorder(recorder, changes);
    tree.commitUpdate(recorder);
  }
}

/**
 * Renames only the tag names, so attributes, bindings and content stay as
 * written. Every match is renamed, including one that parse5 nests inside a
 * self-closing `<stache-blockquote />`, since HTML has no self-closing custom
 * elements.
 */
function renameTags(
  recorder: UpdateRecorder,
  content: string,
  offset: number,
): void {
  for (const element of getElementsByTagName(
    STACHE_TAG,
    parseTemplate(content),
  )) {
    const { startTag, endTag } = element.sourceCodeLocation;

    recorder.remove(offset + startTag.startOffset + 1, STACHE_TAG.length);
    recorder.insertLeft(offset + startTag.startOffset + 1, SKYUX_TAG);

    if (endTag) {
      recorder.remove(offset + endTag.startOffset + 2, STACHE_TAG.length);
      recorder.insertLeft(offset + endTag.startOffset + 2, SKYUX_TAG);
    }
  }
}

function renameTemplateTags(tree: Tree, filePath: string): void {
  const content = tree.readText(filePath);

  if (!content.includes(`<${STACHE_TAG}`)) {
    return;
  }

  const recorder = tree.beginUpdate(filePath);

  if (filePath.endsWith('.html')) {
    renameTags(recorder, content, 0);
  } else {
    for (const template of getInlineTemplates(
      parseSourceFile(tree, filePath),
    )) {
      renameTags(
        recorder,
        content.slice(template.start, template.end),
        template.start,
      );
    }
  }

  tree.commitUpdate(recorder);
}

function isTypescriptFile(filePath: string): boolean {
  return filePath.endsWith('.ts') && !filePath.endsWith('.d.ts');
}

/**
 * Replaces Stache's blockquote with SKY UX's standalone `SkyBlockquote`:
 * `StacheBlockquoteModule` is swapped for it, `StacheModule` gets it listed
 * alongside, and every `<stache-blockquote>` in the project's templates
 * becomes `<sky-blockquote>`, keeping its inputs and content.
 */
export function convertStacheBlockquoteToBlockquote(projectPath: string): Rule {
  return async (tree, context) => {
    const filesToConvert: string[] = [];
    const unconvertibleFiles: string[] = [];

    visitProjectFiles(tree, projectPath, (filePath) => {
      if (
        !isTypescriptFile(filePath) ||
        !tree.readText(filePath).includes(STACHE_PACKAGE)
      ) {
        return;
      }

      const source = parseSourceFile(tree, filePath);

      if (hasUnconvertibleStacheUsage(source)) {
        unconvertibleFiles.push(filePath);
      } else if (
        STACHE_CLASS_NAMES.some((className) =>
          isImportedFromPackage(source, className, STACHE_PACKAGE),
        )
      ) {
        filesToConvert.push(filePath);
      }
    });

    for (const filePath of unconvertibleFiles) {
      logOnce(
        context,
        'warn',
        `"${filePath}" uses "${STACHE_BLOCKQUOTE_MODULE}" or "${STACHE_MODULE}" from "${STACHE_PACKAGE}" through an alias, a namespace import or a re-export, which this schematic does not convert, so no files were changed. Import them by name instead, then run this schematic again.`,
      );
    }

    if (unconvertibleFiles.length > 0 || filesToConvert.length === 0) {
      return;
    }

    for (const filePath of filesToConvert) {
      addSkyBlockquoteAfterStacheModule(tree, filePath);
      swapStacheBlockquoteModule(tree, filePath);
      importExportedSkyBlockquote(tree, filePath);
    }

    visitProjectFiles(tree, projectPath, (filePath) => {
      if (isTypescriptFile(filePath) || filePath.endsWith('.html')) {
        renameTemplateTags(tree, filePath);
      }
    });

    visitProjectFiles(tree, projectPath, (filePath) => {
      if (
        !filePath.endsWith('.d.ts') &&
        LEFTOVER_REFERENCE_EXTENSIONS.some((extension) =>
          filePath.endsWith(extension),
        ) &&
        tree.readText(filePath).includes(STACHE_TAG)
      ) {
        logOnce(
          context,
          'warn',
          `"${filePath}" still refers to "${STACHE_TAG}", for example in a style or test selector. Update it for "${SKYUX_TAG}", which renders different markup and classes.`,
        );
      }
    });

    return await swapPackageDependency(
      tree,
      projectPath,
      STACHE_PACKAGE,
      SKYUX_PACKAGE,
    );
  };
}
