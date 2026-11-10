import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { addDependency } from '@schematics/angular/utility';
import {
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';
import ts from 'typescript';

import { isPackageUsed } from '../../utility/dependencies';
import { logOnce } from '../../utility/log-once';
import {
  getLocalImportName,
  isImportedFromPackage,
  parseSourceFile,
} from '../../utility/typescript/ng-ast';
import {
  isDecoratorMetadataArray,
  removeClassReference,
} from '../../utility/typescript/remove-class-reference';
import { swapImportedClass } from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';

const STACHE_PACKAGE = '@blackbaud/skyux-lib-code-block';
const STACHE_CLASS_NAME = 'SkyCodeModule';
const SKYUX_PACKAGE = '@skyux/code';
const SKYUX_CLASS_NAME = 'SkyCode';

const METADATA_FIELDS = ['imports', 'exports'];

/**
 * True if `reference` sits in a decorator or `TestBed` metadata array that
 * already lists `skyCodeName`. Swapping it there would list `SkyCode` twice,
 * so `removeClassReference` removes it instead. Other arrays are swapped,
 * since `removeClassReference` leaves them alone.
 */
function isInMetadataArrayWith(
  reference: ts.Identifier,
  skyCodeName: string,
): boolean {
  const array = reference.parent;

  return (
    ts.isArrayLiteralExpression(array) &&
    isDecoratorMetadataArray(array, METADATA_FIELDS) &&
    array.elements.some(
      (element) => ts.isIdentifier(element) && element.text === skyCodeName,
    )
  );
}

function isStacheSpecifier(specifier: ts.Expression | undefined): boolean {
  return (
    !!specifier &&
    ts.isStringLiteral(specifier) &&
    specifier.text === STACHE_PACKAGE
  );
}

/**
 * True if the file reaches `SkyCodeModule` through an aliased import, a
 * namespace import or a re-export. `swapImportedClass` only rewrites plain
 * named imports, so converting the rest of such a file could leave a
 * component with both Stache's `sky-code` and `SkyCode` (NG0300).
 */
function hasUnconvertibleStacheUsage(source: ts.SourceFile): boolean {
  const localName = getLocalImportName(
    source,
    STACHE_CLASS_NAME,
    STACHE_PACKAGE,
  );

  if (localName !== undefined && localName !== STACHE_CLASS_NAME) {
    return true;
  }

  return source.statements.some((statement) =>
    ts.isExportDeclaration(statement)
      ? isStacheSpecifier(statement.moduleSpecifier)
      : ts.isImportDeclaration(statement) &&
        !!statement.importClause?.namedBindings &&
        ts.isNamespaceImport(statement.importClause.namedBindings) &&
        isStacheSpecifier(statement.moduleSpecifier),
  );
}

/**
 * Returns `true` when the file's `SkyCodeModule` from Stache was converted.
 */
function convertTypescriptFile(
  tree: Tree,
  filePath: string,
  context: SchematicContext,
): boolean {
  if (!tree.readText(filePath).includes(STACHE_CLASS_NAME)) {
    return false;
  }

  const source = parseSourceFile(tree, filePath);

  if (hasUnconvertibleStacheUsage(source)) {
    logOnce(
      context,
      'warn',
      `"${filePath}" uses "${STACHE_CLASS_NAME}" from "${STACHE_PACKAGE}" through an alias, a namespace import or a re-export, which this schematic does not convert. Replace it with "${SKYUX_CLASS_NAME}" from "${SKYUX_PACKAGE}" manually.`,
    );
    return false;
  }

  if (!isImportedFromPackage(source, STACHE_CLASS_NAME, STACHE_PACKAGE)) {
    return false;
  }

  const skyCodeName =
    getLocalImportName(source, SKYUX_CLASS_NAME, SKYUX_PACKAGE) ??
    SKYUX_CLASS_NAME;

  const swapRecorder = tree.beginUpdate(filePath);
  swapImportedClass(swapRecorder, filePath, source, [
    {
      classNames: { [STACHE_CLASS_NAME]: SKYUX_CLASS_NAME },
      moduleName: { old: STACHE_PACKAGE, new: SKYUX_PACKAGE },
      filter: (reference): boolean =>
        !isInMetadataArrayWith(reference, skyCodeName),
      localNames: { [SKYUX_CLASS_NAME]: skyCodeName },
    },
  ]);
  tree.commitUpdate(swapRecorder);

  const swappedSource = parseSourceFile(tree, filePath);

  if (isImportedFromPackage(swappedSource, STACHE_CLASS_NAME, STACHE_PACKAGE)) {
    const removeRecorder = tree.beginUpdate(filePath);
    removeClassReference(
      removeRecorder,
      swappedSource,
      STACHE_CLASS_NAME,
      STACHE_PACKAGE,
      METADATA_FIELDS,
    );
    tree.commitUpdate(removeRecorder);
  }

  return true;
}

/**
 * Replaces Stache's `SkyCodeModule` with SKY UX's standalone `SkyCode`. Both
 * use the `sky-code` selector, so templates are unchanged.
 */
export function convertStacheCodeToCode(projectPath: string): Rule {
  let anyConverted = false;

  return chain([
    (tree, context): void => {
      visitProjectFiles(tree, projectPath, (filePath) => {
        if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
          anyConverted =
            convertTypescriptFile(tree, filePath, context) || anyConverted;
        }
      });
    },
    async (tree): Promise<Rule | void> => {
      if (!anyConverted) {
        return;
      }

      if (!(await isPackageUsed(tree, STACHE_PACKAGE))) {
        removePackageJsonDependency(tree, STACHE_PACKAGE);
      }

      // `addDependency` only checks `dependencies`, so it would add a second
      // entry for a package already listed under `devDependencies`.
      if (!getPackageJsonDependency(tree, SKYUX_PACKAGE)) {
        return addDependency(SKYUX_PACKAGE, '0.0.0-PLACEHOLDER');
      }
    },
  ]);
}
