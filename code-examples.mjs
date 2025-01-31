import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';

import glob from 'fast-glob';
import fsExtra from 'fs-extra';

// import prettier from 'prettier';
// import * as ts from 'typescript';

const DEST = 'libs/components/code-examples/src/lib/modules/';
const DEST_ENTRY_POINT = 'libs/components/code-examples/src/index.ts';

await fsExtra.remove(DEST);
await fsExtra.remove(DEST_ENTRY_POINT);
await fsExtra.copy('apps/code-examples/src/app/code-examples', DEST);

const files = await glob(DEST + '**/demo.component.ts');

function generateNamesFromPath(file) {
  const fragments = Array.from(
    new Set(file.replace(DEST, '').replace('.component.ts', '').split('/')),
  );

  const trimmedPath = fragments.join('_');
  const baseClass = classify(trimmedPath)
    .replace('DemoDemo', 'Demo')
    .replace('Demo', 'Example');

  return {
    className: `${baseClass}Component`,
    selector: `app-${dasherize(baseClass)}`,
  };
}

const data = [];
const classNames = [];
const selectors = [];

for (const file of files) {
  const { className, selector } = generateNamesFromPath(file);

  if (classNames.includes(className)) {
    throw new Error(`Duplicate name discovered ${className}`);
  }

  classNames.push(className);

  if (selectors.includes(selector)) {
    throw new Error(`Duplicate selector detected ${selector}`);
  }

  selectors.push(selector);

  const contents = await fsExtra.readFile(file, { encoding: 'utf-8' });

  // const sourceFile = ts.createSourceFile(
  //   file,
  //   await fsExtra.readFile(file, { encoding: 'utf-8' }),
  //   ts.ScriptTarget.Latest,
  // );

  // function changeName(context) {
  //   return (sourceFile) => {
  //     const visitor = (node) => {
  //       if (ts.isClassDeclaration(node)) {
  //         return ts.factory.updateClassDeclaration(
  //           node,
  //           node.modifiers,
  //           ts.factory.createIdentifier(className),
  //           node.typeParameters,
  //           node.heritageClauses,
  //           node.members,
  //         );
  //       }

  //       return ts.visitEachChild(node, visitor, context);
  //     };

  //     return ts.visitNode(sourceFile, visitor, ts.isSourceFile);
  //   };
  // }

  // const result = ts.transform(sourceFile, [changeName]);
  // const printer = ts.createPrinter();

  // const prettierOptions = await prettier.resolveConfig('.prettierrc');

  // const newContents = printer
  //   .printFile(result.transformed[0])
  //   .replace(`selector: "app-demo",`, `selector: '${selector}',`);

  const newContents = contents
    .replace(`selector: 'app-demo',`, `selector: '${selector}',`)
    .replace(`class DemoComponent `, `class ${className} `);

  await fsExtra.writeFile(file, newContents, {
    encoding: 'utf-8',
  });

  const specFile = file.replace(
    '/demo.component.ts',
    '/demo.component.spec.ts',
  );

  if (fsExtra.existsSync(specFile)) {
    await fsExtra.writeFile(
      specFile,
      (await fsExtra.readFile(specFile, { encoding: 'utf-8' })).replaceAll(
        'DemoComponent',
        className,
      ),
      {
        encoding: 'utf-8',
      },
    );
  }

  // await fsExtra.writeFile(
  //   file,
  //   await prettier.format(await fsExtra.readFile(file, { encoding: 'utf-8' }), {
  //     ...prettierOptions,
  //     filepath: '.prettierrc',
  //   }),
  //   {
  //     encoding: 'utf-8',
  //   },
  // );

  data.push({
    className,
    importPath: `.${file
      .replace(/\.ts$/, '')
      .replace(DEST_ENTRY_POINT.replace('/index.ts', ''), '')}`.replace(
      '/demo.component',
      '/example.component',
    ),
  });
}

let entryPointContents = '';

for (const d of data) {
  entryPointContents += `export {${d.className}} from '${d.importPath}';\n`;
}

await fsExtra.writeFile(DEST_ENTRY_POINT, entryPointContents);

const oldFiles = await glob(DEST + '**/demo.*');
for (const oldFile of oldFiles) {
  await fsExtra.rename(oldFile, oldFile.replace('/demo.', '/example.'));
}

for (const f of await glob(DEST + '**/*')) {
  await fsExtra.writeFile(
    f,
    (await fsExtra.readFile(f, { encoding: 'utf-8' })).replace(
      /demo/g,
      'example',
    ),
    {
      encoding: 'utf-8',
    },
  );
}
