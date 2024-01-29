/**
 * The contents of this file are heavily inspired by Angular's "untyped forms" migration.
 * @see https://github.com/angular/angular/blob/14.3.x/packages/core/schematics/migrations/typed-forms/index.ts
 */
import { Rule, Tree, UpdateRecorder } from '@angular-devkit/schematics';

import { readRequiredFile } from '../../../utility/tree';
import { getImports, getUsages } from '../../../utility/typescript/imports';
import { createSourceFile } from '../../../utility/typescript/source-file';
import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getWorkspace } from '../../../utility/workspace';

type RewriteFn = (startPos: number, origLength: number, text: string) => void;

// A collection of services (and their packages) that should be replaced with "legacy" versions.
const packages = new Map<string, string[]>([
  ['@skyux/core', ['SkyDynamicComponentService', 'SkyOverlayService']],
  ['@skyux/flyout', ['SkyFlyoutService']],
  ['@skyux/modals', ['SkyModalService']],
  ['@skyux/toast', ['SkyToastService']],
]);

function runLegacyServicesMigration(tree: Tree, filePath: string): void {
  const sourceFile = createSourceFile(
    filePath,
    readRequiredFile(tree, filePath),
  );

  let update: UpdateRecorder | null = null;

  const rewriter: RewriteFn = (
    startPos: number,
    origLength: number,
    text: string,
  ) => {
    if (update === null) {
      // Lazily initialize update, because most files will not require migration.
      update = tree.beginUpdate(sourceFile.fileName);
    }

    update.remove(startPos, origLength);
    update.insertLeft(startPos, text);
  };

  const imports = getImports(sourceFile, packages);

  // If no relevant classes are imported, we can exit early.
  if (imports.length === 0) {
    return;
  }

  // For each control class, migrate all of its uses.
  for (const imp of imports) {
    const usages = getUsages(sourceFile, imp);

    for (const usage of usages) {
      const newName = getLegacyVersionOfName(imp.getText(sourceFile));

      if (newName) {
        rewriter(
          usage.node.getStart(sourceFile),
          usage.node.getWidth(sourceFile),
          newName,
        );
      }
    }
  }

  // For each imported control class, migrate to the corresponding legacy import.
  for (const imp of imports) {
    // If the import specifier has a property name, use that instead (for example, `import {PropertyName as Foo}`).
    const item = imp.propertyName ?? imp;

    rewriter(
      item.getStart(sourceFile),
      item.getWidth(sourceFile),
      getLegacyVersionOfName(item.getText(sourceFile)),
    );
  }

  if (update) {
    tree.commitUpdate(update);
  }
}

function getLegacyVersionOfName(name: string): string {
  return name.replace(/(?:Service)$/, 'LegacyService');
}

/**
 * Replaces certain SKY UX services with their "legacy" equivalents.
 * For example, `SkyModalService` becomes `SkyModalLegacyService`.
 */
export default function (): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);

    workspace.projects.forEach((project) => {
      visitProjectFiles(tree, project.root, (filePath) => {
        if (filePath.endsWith('.ts')) {
          runLegacyServicesMigration(tree, filePath);
        }
      });
    });
  };
}
