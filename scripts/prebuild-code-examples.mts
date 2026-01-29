import { formatFiles, workspaceRoot } from '@nx/devkit';

import { FsTree } from 'nx/src/generators/tree.js';
import ts from 'typescript';

void (async () => {
  const tree = new FsTree(workspaceRoot, false);
  const codeExampleBarrelFile = 'libs/components/code-examples/src/index.ts';
  const codeExampleRoutesFile =
    'libs/components/code-examples/routes/src/index.ts';

  const codeExampleBarrelSource = ts.createSourceFile(
    codeExampleBarrelFile,
    tree.read(codeExampleBarrelFile, 'utf8'),
    ts.ScriptTarget.Latest,
  );
  const codeExamples = codeExampleBarrelSource
    .getChildren()
    .flatMap((node) => node.getChildren())
    .filter(
      (node): node is ts.ExportDeclaration =>
        ts.isExportDeclaration(node) && ts.isNamedExports(node.exportClause),
    )
    .flatMap(({ exportClause }): string[] =>
      exportClause.elements
        .filter(ts.isExportSpecifier)
        .map((element): ts.Identifier => element.propertyName ?? element.name)
        .map((identifier): string => identifier.text),
    )
    .filter(Boolean);
  if (codeExamples.length === 0) {
    throw new Error(`No code examples found for ${codeExampleBarrelFile}`);
  }
  codeExamples.sort((a, b) => a.localeCompare(b));
  const codeExamplesRoutesFileCode = `import { Routes } from '@angular/router';

export const routes: Routes = [${codeExamples
    .map(
      (codeExample) => `
  {
    path: '${codeExample}',
    loadComponent: () =>
      import('@skyux/code-examples').then(
        ({ ${codeExample}: c }) => c,
      ),
  },`,
    )
    .join('')}
];
export default routes;
`;
  tree.write(codeExampleRoutesFile, codeExamplesRoutesFileCode);

  await formatFiles(tree);
})();
