import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';

import glob from 'fast-glob';
import fsExtra from 'fs-extra';
// import prettier from 'prettier';
import * as ts from 'typescript';

const DEST = 'libs/components/code-examples/src/lib/modules/';

await fsExtra.remove(DEST);
await fsExtra.copy('apps/code-examples/src/app/code-examples', DEST);

const files = await glob(DEST + '**/demo.component.ts');

console.log('Num demo files:', files.length);

function generateNamesFromPath(file) {
  const fragments = Array.from(
    new Set(file.replace(DEST, '').replace('.component.ts', '').split('/')),
  );

  const trimmedPath = fragments.join('_');
  const baseClass = classify(trimmedPath).replace('DemoDemo', 'Demo');

  return {
    className: `Sky${baseClass}Component`,
    selector: `sky-${dasherize(baseClass)}`,
  };
}

const classNames = [];
const selectors = [];

for (const file of files) {
  const { className, selector } = generateNamesFromPath(file);
  console.log(selector);

  if (classNames.includes(className)) {
    throw new Error(`Duplicate name discovered ${className}`);
  }

  classNames.push(className);

  if (selectors.includes(selector)) {
    throw new Error(`Duplicate selector detected ${selector}`);
  }

  selectors.push(selector);

  const sourceFile = ts.createSourceFile(
    file,
    await fsExtra.readFile(file, { encoding: 'utf-8' }),
    ts.ScriptTarget.Latest,
  );

  function changeName(context) {
    return (sourceFile) => {
      const visitor = (node) => {
        if (ts.isClassDeclaration(node)) {
          return ts.factory.updateClassDeclaration(
            node,
            node.modifiers,
            ts.factory.createIdentifier(className),
            node.typeParameters,
            node.heritageClauses,
            node.members,
          );
        }

        return ts.visitEachChild(node, visitor, context);
      };

      return ts.visitNode(sourceFile, visitor, ts.isSourceFile);
    };
  }

  const result = ts.transform(sourceFile, [changeName]);
  const printer = ts.createPrinter();

  // const prettierOptions = await prettier.resolveConfig('.prettierrc');

  // console.log(
  //   await prettier.format(printer.printFile(result.transformed[0]), {
  //     ...prettierOptions,
  //     filepath: '.prettierrc',
  //   }),
  // );

  const newContents = printer
    .printFile(result.transformed[0])
    .replace(`selector: "app-demo",`, `selector: '${selector}',`);

  await fsExtra.writeFile(file, newContents, {
    encoding: 'utf-8',
  });
}
