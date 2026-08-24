import { Rule, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import ts from 'typescript';

import { parseSourceFile } from '../../../utility/typescript/ng-ast';
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

      const recorder = tree.beginUpdate(filePath);

      swapImportedClass(recorder, filePath, parseSourceFile(tree, filePath), [
        {
          classNames: CLASS_NAMES,
          moduleName: MODULE_NAME,
          filter: (node): boolean => !isStaticAddResourcesReference(node),
        },
      ]);

      tree.commitUpdate(recorder);
    });
  });
}

/**
 * Replaces the resources services with their "legacy" equivalents, which emit
 * once and complete. The original services now emit again whenever the locale
 * changes.
 */
export default function (): Rule {
  return async (tree: Tree): Promise<void> => {
    await updateSourceFiles(tree);
  };
}
