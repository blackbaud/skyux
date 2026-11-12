import { Rule, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import { getEOL } from '@schematics/angular/utility/eol';
import ts from 'typescript';

import { swapPackageDependency } from '../../utility/dependencies';
import { logOnce } from '../../utility/log-once';
import { getElementsByTagName, parseTemplate } from '../../utility/template';
import { hasUnconvertibleUsage } from '../../utility/typescript/has-unconvertible-usage';
import {
  getInlineTemplates,
  getLocalImportName,
  isImportedFromPackage,
  parseSourceFile,
} from '../../utility/typescript/ng-ast';
import {
  importExportedStandalone,
  swapModuleForStandalone,
} from '../../utility/typescript/swap-module-for-standalone';
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

const LEFTOVER_REFERENCE_EXTENSIONS = [
  '.ts',
  '.html',
  '.css',
  '.scss',
  '.sass',
  '.less',
];

/**
 * Stache's aggregate module stays, since it provides Stache's other
 * components, so `SkyBlockquote` is listed right after it wherever it's listed.
 */
function addSkyBlockquoteAfterStacheModule(tree: Tree, filePath: string): void {
  const source = parseSourceFile(tree, filePath);

  if (!isImportedFromPackage(source, STACHE_MODULE, STACHE_PACKAGE)) {
    return;
  }

  const skyBlockquoteName =
    getLocalImportName(source, SKYUX_CLASS_NAME, SKYUX_PACKAGE) ??
    SKYUX_CLASS_NAME;
  const references = findNodes(source, ts.SyntaxKind.Identifier).filter(
    (node) =>
      ts.isIdentifier(node) &&
      node.text === STACHE_MODULE &&
      ts.isArrayLiteralExpression(node.parent) &&
      !node.parent.elements.some(
        (element) =>
          ts.isIdentifier(element) && element.text === skyBlockquoteName,
      ),
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

  importExportedStandalone(tree, filePath, skyBlockquoteName);
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
    const templateFiles: string[] = [];
    const filesToConvert: string[] = [];
    const unconvertibleFiles: string[] = [];

    visitProjectFiles(tree, projectPath, (filePath) => {
      if (!isTypescriptFile(filePath) && !filePath.endsWith('.html')) {
        return;
      }

      const content = tree.readText(filePath);

      if (content.includes(`<${STACHE_TAG}`)) {
        templateFiles.push(filePath);
      }

      if (filePath.endsWith('.html') || !content.includes(STACHE_PACKAGE)) {
        return;
      }

      const source = parseSourceFile(tree, filePath);

      if (hasUnconvertibleUsage(source, STACHE_PACKAGE, STACHE_CLASS_NAMES)) {
        unconvertibleFiles.push(filePath);
      } else if (
        STACHE_CLASS_NAMES.some((className) =>
          isImportedFromPackage(source, className, STACHE_PACKAGE),
        )
      ) {
        filesToConvert.push(filePath);
      }
    });

    // A project that never renders a Stache blockquote has nothing to
    // convert, so a project that only lists `StacheModule` is left alone.
    if (templateFiles.length === 0) {
      return;
    }

    // Every `<stache-blockquote>` in the project is renamed, so a tag whose
    // provider this schematic can't convert would lose its component.
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
      swapModuleForStandalone(
        tree,
        filePath,
        { className: STACHE_BLOCKQUOTE_MODULE, packageName: STACHE_PACKAGE },
        { className: SKYUX_CLASS_NAME, packageName: SKYUX_PACKAGE },
      );
    }

    for (const filePath of templateFiles) {
      renameTemplateTags(tree, filePath);
    }

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
