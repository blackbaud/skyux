import { Rule, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import { getEOL } from '@schematics/angular/utility/eol';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import ts from 'typescript';

import {
  isImportedFromPackage,
  parseSourceFile,
} from '../../../utility/typescript/ng-ast';
import { swapImportedClass } from '../../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../../utility/visit-project-files';

const MODULE_NAME = '@skyux/i18n';

const CLASS_NAMES: Record<string, string> = {
  SkyAppResourcesService: 'SkyAppResourcesLegacyService',
  SkyLibResourcesService: 'SkyLibResourcesLegacyService',
};

/**
 * Whether the reference is the `SkyLibResourcesService.addResources()` static
 * call. Only the observables returned by the instance methods changed, so
 * static calls -- which generated resources modules rely on -- are left alone.
 */
function isStaticAddResourcesReference(node: ts.Identifier): boolean {
  const parent = node.parent;

  return (
    ts.isPropertyAccessExpression(parent) &&
    parent.expression === node &&
    parent.name.text === 'addResources'
  );
}

/**
 * Whether the reference is the `provide:` token of a provider object literal
 * inside an array, e.g. `{ provide: SkyAppResourcesService, ... }` in a
 * `providers: [...]` list. These are duplicated rather than renamed -- see
 * `duplicateProviderTokens` -- since test doubles registered under the
 * original token would otherwise stop matching the pipe and matchers that
 * still inject it.
 */
function isProviderToken(node: ts.Identifier): boolean {
  const propertyAssignment = node.parent;

  if (
    !ts.isPropertyAssignment(propertyAssignment) ||
    propertyAssignment.initializer !== node ||
    propertyAssignment.name.getText() !== 'provide'
  ) {
    return false;
  }

  const objectLiteral = propertyAssignment.parent;

  return (
    ts.isObjectLiteralExpression(objectLiteral) &&
    ts.isArrayLiteralExpression(objectLiteral.parent)
  );
}

/**
 * The whitespace between the start of `node`'s line and `node` itself, used
 * to indent an inserted sibling the same as the node it follows. Returns
 * `undefined` when `node` isn't the first thing on its line (e.g. a
 * single-line `providers: [{ provide: X, ... }]`) -- the text preceding it
 * on the line is code, not indentation, and repeating it would corrupt the
 * file.
 */
function getLineIndent(
  node: ts.Node,
  sourceFile: ts.SourceFile,
): string | undefined {
  const text = sourceFile.text;
  const lineStart = text.lastIndexOf('\n', node.getStart() - 1) + 1;
  const prefix = text.slice(lineStart, node.getStart());
  return /^\s*$/.test(prefix) ? prefix : undefined;
}

/**
 * Whether `array` already contains a provider object literal whose `provide`
 * token is `legacyClassName`. Keeps the migration idempotent: re-running it,
 * or running it against a file someone already hand-fixed, doesn't add a
 * second twin.
 */
function arrayHasLegacyProvider(
  array: ts.ArrayLiteralExpression,
  legacyClassName: string,
): boolean {
  return array.elements.some(
    (element) =>
      ts.isObjectLiteralExpression(element) &&
      element.properties.some(
        (property) =>
          ts.isPropertyAssignment(property) &&
          property.name.getText() === 'provide' &&
          ts.isIdentifier(property.initializer) &&
          property.initializer.text === legacyClassName,
      ),
  );
}

/**
 * For every `provide:` token referencing a renamed class, inserts a twin
 * provider for the legacy class right after it, e.g.
 * `{ provide: SkyAppResourcesService, useClass: SkyAppResourcesTestService }`
 * gets a
 * `{ provide: SkyAppResourcesLegacyService, useClass: SkyAppResourcesTestService }`
 * sibling. Returns the legacy class names that received a twin, so the
 * caller can ensure each one is imported.
 */
function duplicateProviderTokens(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  eol: string,
): Set<string> {
  const twinnedClassNames = new Set<string>();

  Object.entries(CLASS_NAMES).forEach(([oldClassName, legacyClassName]) => {
    const tokens = findNodes(sourceFile, ts.SyntaxKind.Identifier).filter(
      (node): node is ts.Identifier =>
        ts.isIdentifier(node) &&
        node.text === oldClassName &&
        isProviderToken(node),
    );

    tokens.forEach((token) => {
      const objectLiteral = token.parent.parent as ts.ObjectLiteralExpression;
      const array = objectLiteral.parent as ts.ArrayLiteralExpression;

      if (arrayHasLegacyProvider(array, legacyClassName)) {
        return;
      }

      const originalText = objectLiteral.getText();
      const offset = token.getStart() - objectLiteral.getStart();
      const twinText =
        originalText.slice(0, offset) +
        legacyClassName +
        originalText.slice(offset + token.getWidth());
      const indent = getLineIndent(objectLiteral, sourceFile);
      const separator = indent === undefined ? ' ' : `${eol}${indent}`;

      recorder.insertRight(objectLiteral.getEnd(), `,${separator}${twinText}`);
      twinnedClassNames.add(legacyClassName);
    });
  });

  return twinnedClassNames;
}

/**
 * Imports `legacyClassName` if it isn't already. `swapImportedClass` adds the
 * legacy import itself whenever it renames a non-provider reference, so this
 * only has work to do when `duplicateProviderTokens` inserted a twin but
 * every other reference to the class was a provider token.
 */
function ensureLegacyImport(
  tree: Tree,
  filePath: string,
  legacyClassName: string,
): void {
  const sourceFile = parseSourceFile(tree, filePath);

  if (isImportedFromPackage(sourceFile, legacyClassName, MODULE_NAME)) {
    return;
  }

  const change = insertImport(
    sourceFile,
    filePath,
    legacyClassName,
    MODULE_NAME,
  );
  const recorder = tree.beginUpdate(filePath);
  applyToUpdateRecorder(recorder, [change]);
  tree.commitUpdate(recorder);
}

async function updateSourceFiles(tree: Tree): Promise<void> {
  const workspace = await getWorkspace(tree);

  workspace.projects.forEach((project) => {
    visitProjectFiles(tree, project.sourceRoot || project.root, (filePath) => {
      if (!filePath.endsWith('.ts')) {
        return;
      }

      const content = tree.readText(filePath);

      if (!Object.keys(CLASS_NAMES).some((name) => content.includes(name))) {
        return;
      }

      const sourceFile = parseSourceFile(tree, filePath);
      const recorder = tree.beginUpdate(filePath);

      swapImportedClass(recorder, filePath, sourceFile, [
        {
          classNames: CLASS_NAMES,
          moduleName: MODULE_NAME,
          filter: (node): boolean =>
            !isStaticAddResourcesReference(node) && !isProviderToken(node),
        },
      ]);

      const twinnedClassNames = duplicateProviderTokens(
        recorder,
        sourceFile,
        getEOL(sourceFile.text),
      );

      tree.commitUpdate(recorder);

      twinnedClassNames.forEach((legacyClassName) => {
        ensureLegacyImport(tree, filePath, legacyClassName);
      });
    });
  });
}

/**
 * Replaces the resources services with their "legacy" equivalents, which emit
 * once and complete. The original services now emit again whenever the
 * locale changes.
 *
 * A `provide:` token inside a `providers: [...]` array (e.g. a test's
 * `TestBed.configureTestingModule`) is duplicated instead of renamed: the
 * original provider stays, and a legacy twin is added right after it. The
 * `skyAppResources` pipe and the `toHaveResourceText`/`toEqualResourceText`
 * matchers still inject the original service, so renaming the provider
 * outright would leave them resolving against the real, un-mocked service.
 */
export default function (): Rule {
  return async (tree: Tree): Promise<void> => {
    await updateSourceFiles(tree);
  };
}
