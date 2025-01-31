import { classify } from '@angular-devkit/core/src/utils/strings';

import glob from 'fast-glob';
import fsExtra from 'fs-extra';
import * as ts from 'typescript';

const DEST = 'libs/components/code-examples/src/lib/modules/';

// await fsExtra.remove(DEST);
// await fsExtra.copy('apps/code-examples/src/app/code-examples', DEST);

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
  // console.log('FILE', file);
  console.log(newName);

  if (names.includes(newName)) {
    throw new Error(`Duplicate name discovered ${newName}`);
  }

  names.push(newName);

  const source = ts.createSourceFile(
    file,
    await fsExtra.readFile(file, { encoding: 'utf-8' }),
    ts.ScriptTarget.Latest,
  );

  source.forEachChild((node) => {
    if (ts.isClassDeclaration(node)) {
      // console.log('NAME', node.name?.escapedText);
    }
  });
}
