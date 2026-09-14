import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { removePackageJsonDependency } from '@schematics/angular/utility/dependencies';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { isPackageUsed } from '../../../utility/dependencies';
import { logOnce } from '../../../utility/log-once';
import { getElementsByTagName, parseTemplate } from '../../../utility/template';
import {
  getInlineTemplates,
  getLocalImportName,
  parseSourceFile,
} from '../../../utility/typescript/ng-ast';
import { removeClassReference } from '../../../utility/typescript/remove-class-reference';
import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getSourceRoot } from '../../../utility/workspace';

const SELECTOR = 'sky-select-field';
const CLASS_NAME = 'SkySelectFieldModule';
const PACKAGE_NAME = '@skyux/select-field';

function contentHasSelector(content: string): boolean {
  return getElementsByTagName(SELECTOR, parseTemplate(content)).length > 0;
}

/**
 * True if any `.html` template or inline `@Component({ template })` anywhere
 * in the project contains a `<sky-select-field>` element.
 */
function projectUsesSelectField(tree: Tree, sourceRoot: string): boolean {
  let used = false;

  visitProjectFiles(tree, sourceRoot, (filePath) => {
    if (used) {
      return;
    }

    if (filePath.endsWith('.html')) {
      const content = tree.readText(filePath);
      if (content.includes(`<${SELECTOR}`) && contentHasSelector(content)) {
        used = true;
      }
      return;
    }

    if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
      const content = tree.readText(filePath);
      if (!content.includes(`<${SELECTOR}`)) {
        return;
      }
      const source = parseSourceFile(tree, filePath);
      used = getInlineTemplates(source).some((template) =>
        contentHasSelector(content.slice(template.start, template.end)),
      );
    }
  });

  return used;
}

/**
 * Removes `SkySelectFieldModule` from every decorator `imports` array (and
 * the now-unused import statement) throughout the project.
 */
function removeModuleReferences(
  tree: Tree,
  sourceRoot: string,
  context: SchematicContext,
): void {
  visitProjectFiles(tree, sourceRoot, (filePath) => {
    if (!filePath.endsWith('.ts') || filePath.endsWith('.d.ts')) {
      return;
    }

    const content = tree.readText(filePath);
    if (!content.includes(CLASS_NAME)) {
      return;
    }

    const source = parseSourceFile(tree, filePath);

    // `SkySelectFieldModule` may be imported under an alias (`SkySelectFieldModule
    // as Foo`); `removeClassReference`/`removeImport` match on the local
    // identifier, so resolve it (and confirm the import exists) up front.
    const localName = getLocalImportName(source, CLASS_NAME, PACKAGE_NAME);
    if (!localName) {
      return;
    }

    const recorder = tree.beginUpdate(filePath);
    const removed = removeClassReference(
      recorder,
      source,
      localName,
      PACKAGE_NAME,
    );
    tree.commitUpdate(recorder);

    if (!removed) {
      logOnce(
        context,
        'warn',
        `The "${CLASS_NAME}" import in "${filePath}" was kept because it is referenced outside a decorator "imports" array (for example in a TestBed configuration). Remove the import manually if it is no longer needed.`,
      );
    }
  });
}

/**
 * Removes the `SkySelectFieldModule` import from projects that no longer
 * reference `<sky-select-field>` in any template, and drops the
 * `@skyux/select-field` dependency once nothing in the workspace imports it.
 */
export default function (): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    const workspace = await getWorkspace(tree);

    for (const project of workspace.projects.values()) {
      const sourceRoot = getSourceRoot(project);
      if (!projectUsesSelectField(tree, sourceRoot)) {
        removeModuleReferences(tree, sourceRoot, context);
      }
    }

    if (!(await isPackageUsed(tree, PACKAGE_NAME))) {
      removePackageJsonDependency(tree, PACKAGE_NAME);
    }
  };
}
