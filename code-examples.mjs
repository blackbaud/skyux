import { classify } from '@angular-devkit/core/src/utils/strings';

import glob from 'fast-glob';
import fsExtra from 'fs-extra';
import * as ts from 'typescript';

const DEST = 'libs/components/code-examples/src/lib/modules/';

await fsExtra.remove(DEST);
await fsExtra.copy('apps/code-examples/src/app/code-examples', DEST);

const files = await glob(DEST + '**/demo.component.ts');

console.log('Num demo files:', files.length);

function generateClassNameFromPath(file) {
  const fragments = Array.from(
    new Set(file.replace(DEST, '').replace('.component.ts', '').split('/')),
  );

  const trimmedPath = fragments.join('_');

  return `Sky${classify(trimmedPath).replace('DemoDemo', 'Demo')}Component`;
}

const names = [];

for (const file of files) {
  const newName = generateClassNameFromPath(file);

  if (names.includes(newName)) {
    throw new Error(`Duplicate name discovered ${newName}`);
  }

  names.push(newName);

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
            ts.factory.createIdentifier(newName),
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

  await fsExtra.writeFile(file, printer.printFile(result.transformed[0]));
}
