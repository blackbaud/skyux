import { join, normalize } from '@angular-devkit/core';
import {
  Rule,
  Tree,
  UpdateRecorder,
  callRule,
  chain,
  externalSchematic,
} from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import {
  findNodes,
  getDecoratorMetadata,
  getMetadataField,
  insertImport,
  isImported,
} from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';

import { catchError, of, throwError } from 'rxjs';

import {
  isImportedFromPackage,
  parseSourceFile,
} from '../../utility/typescript/ng-ast';
import {
  RemoveImportOptions,
  removeImport,
} from '../../utility/typescript/remove-import';
import {
  SwapImportedClassOptions,
  swapImportedClass,
} from '../../utility/typescript/swap-imported-class';
import { visitProjectFiles } from '../../utility/visit-project-files';

interface DecoratedClassData {
  metadata: ts.ObjectLiteralExpression;
}

type NgModuleDeclaration = ts.PropertyDeclaration & {
  type: ts.TypeReferenceNode;
} & {
  type: { typeArguments: ts.NodeArray<ts.TypeNode> };
};

type PackageMetadata = {
  lambdaMap: Record<string, string>;
  moduleData: Record<string, { exports: string[] }>;
};

interface SkyUxSymbol {
  packageName: string;
  sourceName: string;
  localName: string;
}

interface SkyUxSymbolToNgModule extends SkyUxSymbol {
  ngModule: string;
  maintainImport: boolean;
}

const legacyServices: SwapImportedClassOptions[] = [
  {
    moduleName: '@skyux/core',
    classNames: {
      SkyDynamicComponentLegacyService: 'SkyDynamicComponentService',
      SkyOverlayLegacyService: 'SkyOverlayService',
    },
  },
  {
    moduleName: '@skyux/flyout',
    classNames: { SkyFlyoutLegacyService: 'SkyFlyoutService' },
  },
  {
    moduleName: '@skyux/modals',
    classNames: { SkyModalLegacyService: 'SkyModalService' },
  },
  {
    moduleName: '@skyux/toast',
    classNames: { SkyToastLegacyService: 'SkyToastService' },
  },
];

function getDecoratedClasses(sourceFile: ts.SourceFile): DecoratedClassData[] {
  const classes: DecoratedClassData[] = [];
  ['NgModule', 'Component', 'Directive'].forEach((identifierName) => {
    if (isImportedFromPackage(sourceFile, identifierName, '@angular/core')) {
      const data = getDecoratorMetadata(
        sourceFile,
        identifierName,
        '@angular/core',
      ).filter((node) => ts.isObjectLiteralExpression(node));
      data.forEach((metadata) => {
        classes.push({ metadata });
      });
    }
  });
  if (isImportedFromPackage(sourceFile, 'TestBed', '@angular/core/testing')) {
    const configureTestingModuleCalls = findNodes(
      sourceFile,
      (
        node,
      ): node is ts.CallExpression & {
        arguments: ts.NodeArray<ts.Expression>;
      } =>
        ts.isCallExpression(node) &&
        node.expression.getText() === 'TestBed.configureTestingModule' &&
        node.arguments.length === 1 &&
        ts.isObjectLiteralExpression(node.arguments[0]),
    );
    configureTestingModuleCalls.forEach((call) => {
      classes.push({
        metadata: call.arguments[0] as ts.ObjectLiteralExpression,
      });
    });
  }
  return classes;
}

function getDecoratedClassDeclaration(
  metadata: ts.ObjectLiteralExpression,
): ts.ClassDeclaration {
  let parent: ts.Node = metadata.parent;
  while (parent && !ts.isClassDeclaration(parent)) {
    parent = parent.parent;
  }
  return parent as ts.ClassDeclaration;
}

function getPackageTypeSourceFile(
  tree: Tree,
  packageName: string,
): ts.SourceFile {
  const filePath = join(normalize('node_modules'), packageName, 'index.d.ts');
  if (!packageName || !tree.exists(filePath)) {
    throw new Error(
      `Could not find package ${packageName} -- please run 'npm install'.`,
    );
  }
  return parseSourceFile(tree, filePath);
}

function getLambdaMap(sourceFile: ts.SourceFile): Record<string, string> {
  const lambdaExports = findNodes(
    sourceFile,
    (node): node is ts.ExportSpecifier & { propertyName: ts.Identifier } =>
      ts.isExportSpecifier(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text.startsWith('λ') &&
      !!node.propertyName &&
      ts.isIdentifier(node.propertyName),
  );
  return Object.fromEntries(
    lambdaExports.map((exp) => [exp.name.text, exp.propertyName.text]),
  );
}

/**
 * Finds NgModules and their exported symbols in a package type definition source file.
 * @param packageSourceFile
 */
function getPackageNgModuleMetadata(
  packageSourceFile: ts.SourceFile,
): Record<string, { exports: string[] }> {
  const findNgModuleDeclaration = (
    member: ts.Node,
  ): member is NgModuleDeclaration =>
    ts.isPropertyDeclaration(member) &&
    !!member.type &&
    ts.isTypeReferenceNode(member.type) &&
    member.type.getText().includes('NgModuleDeclaration') &&
    !!member.type.typeArguments?.[0] &&
    !!member.type.typeArguments?.[3] &&
    ts.isTupleTypeNode(member.type.typeArguments[3]);
  const packageNgModuleMetadata = findNodes(
    packageSourceFile,
    (
      node,
    ): node is ts.ClassDeclaration & {
      members: ts.NodeArray<ts.ClassElement>;
    } =>
      ts.isClassDeclaration(node) && node.members.some(findNgModuleDeclaration),
  )
    .map((node) => {
      const member = node.members.find(
        findNgModuleDeclaration,
      ) as NgModuleDeclaration;
      const moduleName = member.type.typeArguments[0].getText();
      const moduleExports = (
        member.type.typeArguments[3] as ts.TupleTypeNode
      ).elements
        .filter(
          (
            element,
          ): element is ts.TypeQueryNode & { exprName: ts.Identifier } =>
            ts.isTypeQueryNode(element) && ts.isIdentifier(element.exprName),
        )
        .map((element) => element.exprName.text);
      return [moduleName, { exports: moduleExports }];
    })
    .filter(Boolean) as [string, { exports: string[] }][];
  return Object.fromEntries(packageNgModuleMetadata);
}

function getSkyuxImports(sourceFile: ts.SourceFile): SkyUxSymbol[] {
  return findNodes(
    sourceFile,
    (
      node,
    ): node is ts.ImportDeclaration & {
      importClause: { namedBindings: ts.NamedImports };
      moduleSpecifier: ts.StringLiteral;
    } =>
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      (node.moduleSpecifier.text.startsWith('@blackbaud') ||
        node.moduleSpecifier.text.startsWith('@skyux')) &&
      !!node.importClause?.namedBindings &&
      ts.isNamedImports(node.importClause.namedBindings),
  ).flatMap((node) =>
    node.importClause.namedBindings.elements.map((sym) => ({
      packageName: node.moduleSpecifier.text,
      localName: sym.name.text,
      sourceName: (sym.propertyName ?? sym.name).text,
    })),
  );
}

function updateNgModuleBindings(
  recorder: UpdateRecorder,
  decoratedClass: DecoratedClassData,
  field: string,
  symbolsToUpdate: SkyUxSymbolToNgModule[],
): void {
  const matchingProperties = getMetadataField(decoratedClass.metadata, field);
  const assignment = matchingProperties[0];
  if (
    !assignment ||
    !ts.isPropertyAssignment(assignment) ||
    !ts.isArrayLiteralExpression(assignment.initializer) ||
    !assignment.initializer.elements.filter(ts.isIdentifier).length
  ) {
    const pipes = symbolsToUpdate.filter((sym) =>
      sym.sourceName.endsWith('Pipe'),
    );
    if (!assignment && field === 'imports' && pipes.length > 0) {
      if (decoratedClass.metadata.properties.length > 1) {
        const spaceBetween = decoratedClass.metadata
          .getText()
          .slice(
            decoratedClass.metadata.properties[0].getEnd() -
              decoratedClass.metadata.getStart(),
            decoratedClass.metadata.properties[1].getStart() -
              decoratedClass.metadata.getStart(),
          );
        recorder.insertLeft(
          decoratedClass.metadata.properties[
            decoratedClass.metadata.properties.length - 1
          ].getEnd(),
          `${spaceBetween}${field}: [${pipes.map(({ ngModule }) => ngModule).join(', ')}]`,
        );
      } else if (decoratedClass.metadata.properties.length > 0) {
        const spaceBetween =
          decoratedClass.metadata
            .getText()
            .charAt(
              decoratedClass.metadata.properties[0].getEnd() -
                decoratedClass.metadata.getStart(),
            ) === ','
            ? ' '
            : ', ';
        recorder.insertLeft(
          decoratedClass.metadata.properties[0].getEnd() + 1,
          `${spaceBetween}${field}: [${pipes.map(({ ngModule }) => ngModule).join(', ')}]`,
        );
      } else {
        recorder.insertLeft(
          decoratedClass.metadata.getEnd() - 1,
          `${field}: [${pipes.map(({ ngModule }) => ngModule).join(', ')}]`,
        );
      }
    }
    return;
  }
  const identifiers = assignment.initializer.elements.filter(ts.isIdentifier);
  const symbolsToAdd = symbolsToUpdate
    .filter((sym) => identifiers.some(({ text }) => sym.localName === text))
    .filter(
      ({ ngModule }) => !identifiers.some(({ text }) => ngModule === text),
    )
    .filter(
      (sym, index, arr) =>
        arr.findIndex(
          (m) =>
            m.packageName === sym.packageName && m.ngModule === sym.ngModule,
        ) === index,
    );
  const symbolsToRemove = identifiers.filter(({ text }) =>
    symbolsToUpdate.some((sym) => sym.localName === text),
  );
  if (symbolsToAdd.length === 0 && symbolsToRemove.length === 0) {
    return;
  }
  const array = Array.from(assignment.initializer.elements.values());
  const firstIndexThatStays = array.findIndex(
    (identifier) =>
      !ts.isIdentifier(identifier) ||
      !symbolsToRemove.some(({ text }) => text === identifier.text),
  );
  if (firstIndexThatStays === -1) {
    recorder.remove(
      assignment.initializer.getStart(),
      assignment.initializer.getWidth(),
    );
    recorder.insertLeft(
      assignment.initializer.getStart(),
      `[${symbolsToAdd.map(({ ngModule }) => ngModule).join(', ')}]`,
    );
  } else {
    const spaceBetween = assignment.initializer
      .getText()
      .slice(
        array[0].getEnd() - assignment.initializer.getStart(),
        array[1].getStart() - assignment.initializer.getStart(),
      );
    symbolsToRemove.forEach((identifier) => {
      const index = array.indexOf(identifier);
      const start =
        index > firstIndexThatStays
          ? array[index - 1].getEnd()
          : identifier.getStart();
      const width =
        (index > firstIndexThatStays
          ? identifier.getEnd()
          : array[index + 1].getStart()) - start;
      recorder.remove(start, width);
    });
    symbolsToAdd.forEach((imp) => {
      recorder.insertRight(
        array[array.length - 1].getEnd(),
        `${spaceBetween}${imp.ngModule}`,
      );
    });
  }
}

function isReferencedOutsideDecorator(
  sourceFile: ts.SourceFile,
  sourceName: string,
  lastImport: ts.ImportDeclaration,
  decoratedClasses: DecoratedClassData[],
): boolean {
  return (
    findNodes(
      sourceFile,
      (node): node is ts.Identifier =>
        ts.isIdentifier(node) &&
        node.text === sourceName &&
        node.getStart() > lastImport.getEnd() &&
        decoratedClasses
          .map(({ metadata }) => {
            const classDeclaration = getDecoratedClassDeclaration(metadata);
            return {
              start: metadata.getEnd(),
              end: classDeclaration.getEnd(),
            };
          })
          .some(
            ({ start, end }) => node.getStart() > start && node.getEnd() < end,
          ),
    ).length > 0
  );
}

function isReferencedInsideDecorator(
  sourceFile: ts.SourceFile,
  sourceName: string,
  lastImport: ts.ImportDeclaration,
  decoratedClasses: DecoratedClassData[],
): boolean {
  return (
    findNodes(
      sourceFile,
      (node): node is ts.Identifier =>
        ts.isIdentifier(node) &&
        node.text === sourceName &&
        node.getStart() > lastImport.getEnd() &&
        decoratedClasses.some(
          ({ metadata }) =>
            node.getStart() > metadata.getStart() &&
            node.getEnd() < metadata.getEnd(),
        ),
    ).length > 0
  );
}

function getSymbolsToUpdate(
  skyuxImports: SkyUxSymbol[],
  packageMetadata: Record<string, PackageMetadata>,
  sourceFile: ts.SourceFile,
  decoratedClasses: DecoratedClassData[],
): SkyUxSymbolToNgModule[] {
  const lastImport = findNodes(
    sourceFile,
    ts.isImportDeclaration,
  ).pop() as ts.ImportDeclaration;
  return skyuxImports
    .filter(
      (imp) =>
        imp.sourceName in packageMetadata[imp.packageName].lambdaMap ||
        (!(imp.sourceName in packageMetadata[imp.packageName].moduleData) &&
          Object.values(packageMetadata[imp.packageName].moduleData).some(
            (mod) => mod.exports.includes(imp.sourceName),
          ) &&
          (imp.sourceName.endsWith('Pipe') ||
            isReferencedInsideDecorator(
              sourceFile,
              imp.sourceName,
              lastImport,
              decoratedClasses,
            ))),
    )
    .map((imp): SkyUxSymbolToNgModule => {
      const isLambda =
        imp.sourceName in packageMetadata[imp.packageName].lambdaMap;
      const sourceName = isLambda
        ? packageMetadata[imp.packageName].lambdaMap[imp.sourceName]
        : imp.sourceName;
      const ngModule = Object.entries(
        packageMetadata[imp.packageName].moduleData,
      ).find(([, mod]) => mod.exports.includes(sourceName))?.[0] as string;
      return {
        ...imp,
        ngModule,
        maintainImport:
          !isLambda &&
          isReferencedOutsideDecorator(
            sourceFile,
            sourceName,
            lastImport,
            decoratedClasses,
          ),
      };
    });
}

function useSkyUxModules(tree: Tree): void {
  const packageMetadata: Record<string, PackageMetadata> = {};
  visitProjectFiles(tree, '', (file) => {
    if (file.endsWith('.ts')) {
      let sourceFile = parseSourceFile(tree, file);
      const skyuxImports = getSkyuxImports(sourceFile);
      if (skyuxImports.length) {
        // Preload package data that was not already loaded.
        skyuxImports
          .map((imp) => imp.packageName)
          .filter((packageName) => !(packageName in packageMetadata))
          .forEach((packageName) => {
            const sourceFile = getPackageTypeSourceFile(tree, packageName);
            packageMetadata[packageName] = {
              moduleData: getPackageNgModuleMetadata(sourceFile),
              lambdaMap: getLambdaMap(sourceFile),
            };
          });

        const decoratedClasses = getDecoratedClasses(sourceFile);
        if (decoratedClasses.length === 0) {
          return;
        }

        // Find the lambda imports and components that should be loaded via modules.
        const symbolsToUpdate = getSymbolsToUpdate(
          skyuxImports,
          packageMetadata,
          sourceFile,
          decoratedClasses,
        );

        const legacyServicesToUpdate = legacyServices.filter((svc) =>
          skyuxImports.some(
            (imp) =>
              svc.moduleName === imp.packageName &&
              imp.sourceName in svc.classNames,
          ),
        );

        if (symbolsToUpdate.length + legacyServicesToUpdate.length === 0) {
          return;
        }

        // Add new imports.
        let recorder = tree.beginUpdate(file);
        symbolsToUpdate
          .filter(
            ({ ngModule, packageName }, index, modulesNeeded) =>
              modulesNeeded.findIndex(
                (m) => m.ngModule === ngModule && m.packageName === packageName,
              ) === index && !isImported(sourceFile, ngModule, packageName),
          )
          .forEach((imp) => {
            applyToUpdateRecorder(recorder, [
              insertImport(sourceFile, file, imp.ngModule, imp.packageName),
            ]);
          });

        decoratedClasses.forEach((decoratedClass) => {
          updateNgModuleBindings(
            recorder,
            decoratedClass,
            'imports',
            symbolsToUpdate,
          );
          updateNgModuleBindings(
            recorder,
            decoratedClass,
            'exports',
            symbolsToUpdate,
          );
        });

        tree.commitUpdate(recorder);
        sourceFile = parseSourceFile(tree, file);
        recorder = tree.beginUpdate(file);

        if (legacyServicesToUpdate.length > 0) {
          swapImportedClass(recorder, file, sourceFile, legacyServicesToUpdate);
          tree.commitUpdate(recorder);
          sourceFile = parseSourceFile(tree, file);
          recorder = tree.beginUpdate(file);
        }

        const removeImports = [
          ...new Set(
            symbolsToUpdate
              .filter((sym) => !sym.maintainImport)
              .map(({ packageName }) => packageName),
          ),
        ].map(
          (moduleName): RemoveImportOptions => ({
            classNames: symbolsToUpdate
              .filter(
                (sym) => sym.packageName === moduleName && !sym.maintainImport,
              )
              .map((sym) => sym.localName),
            moduleName,
          }),
        );
        removeImports.forEach((removeImportOptions) => {
          removeImport(recorder, sourceFile, removeImportOptions);
        });

        tree.commitUpdate(recorder);
      }
    }
  });
}

function ngCoreSchematic(name: string, options: object): Rule {
  return (tree, context) =>
    callRule(
      externalSchematic('@angular/core', name, options, {
        interactive: false,
      }),
      tree,
      context,
    ).pipe(
      catchError((err: Error) => {
        if (err.message.includes('Could not find any files to migrate')) {
          return of(tree);
        }
        return throwError(
          () =>
            new Error('Error while converting to standalone modules', {
              cause: err,
            }),
        );
      }),
    );
}

export default function standaloneSchematic(): Rule {
  return chain([
    ngCoreSchematic('standalone-migration', {
      mode: 'convert-to-standalone',
      path: '',
    }),
    useSkyUxModules,
    ngCoreSchematic('route-lazy-loading-migration', { path: '' }),
    ngCoreSchematic('self-closing-tags-migration', {
      format: true,
      path: '',
    }),
    ngCoreSchematic('control-flow-migration', { format: true, path: '' }),
    ngCoreSchematic('cleanup-unused-imports', {}),
  ]);
}
