import { normalize } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { FileVisitor } from '@angular-devkit/schematics/src/tree/interface';
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

const SELECTOR = 'sky-select-field';
const CLASS_NAME = 'SkySelectFieldModule';
const PACKAGE_NAME = '@skyux/select-field';

function contentHasSelector(content: string): boolean {
  return getElementsByTagName(SELECTOR, parseTemplate(content)).length > 0;
}

/**
 * Visits the project's files, skipping those of other projects nested inside
 * it (e.g. `projects/*` under a root app), since each project is judged on its
 * own templates.
 */
function visitOwnProjectFiles(
  tree: Tree,
  projectRoot: string,
  nestedProjectRoots: string[],
  visitor: FileVisitor,
): void {
  visitProjectFiles(tree, projectRoot, (filePath, entry) => {
    if (!nestedProjectRoots.some((root) => filePath.startsWith(`/${root}/`))) {
      visitor(filePath, entry);
    }
  });
}

/**
 * True if any `.html` template or inline `@Component({ template })` anywhere
 * in the project contains a `<sky-select-field>` element.
 */
function projectUsesSelectField(
  tree: Tree,
  projectRoot: string,
  nestedProjectRoots: string[],
): boolean {
  let used = false;

  visitOwnProjectFiles(tree, projectRoot, nestedProjectRoots, (filePath) => {
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
 * Removes `SkySelectFieldModule` from every decorator `imports` and
 * `exports` array and every `TestBed.configureTestingModule` `imports`
 * array (and the now-unused import statement) throughout the project.
 */
function removeModuleReferences(
  tree: Tree,
  projectRoot: string,
  nestedProjectRoots: string[],
  context: SchematicContext,
): void {
  visitOwnProjectFiles(tree, projectRoot, nestedProjectRoots, (filePath) => {
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
      ['imports', 'exports'],
    );

    if (removed) {
      tree.commitUpdate(recorder);
    } else {
      logOnce(
        context,
        'warn',
        `The "${CLASS_NAME}" import in "${filePath}" was kept because it is referenced outside a decorator "imports"/"exports" array or a "TestBed.configureTestingModule" "imports" array. Remove the import manually if it is no longer needed.`,
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
    const projectRoots = [...workspace.projects.values()].map((project) =>
      normalize(project.root),
    );

    for (const projectRoot of projectRoots) {
      const prefix = projectRoot ? `${projectRoot}/` : '';
      const nestedProjectRoots = projectRoots.filter(
        (root) => root !== projectRoot && root.startsWith(prefix),
      );

      if (!projectUsesSelectField(tree, projectRoot, nestedProjectRoots)) {
        removeModuleReferences(tree, projectRoot, nestedProjectRoots, context);
      }
    }

    if (!(await isPackageUsed(tree, PACKAGE_NAME))) {
      removePackageJsonDependency(tree, PACKAGE_NAME);
    }
  };
}
