import { Rule, chain } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { addPolyfillsConfig } from '../../../rules/add-polyfills-config';
import { getWorkspace } from '../../../utility/workspace';

const polyfillBlockStart = `* SKY UX POLYFILLS - DO NOT MODIFY THIS SECTION`;
const polyfillBlockEnd = `* END SKY UX POLYFILLS`;

function removePolyfillCode(): Rule {
  return async (tree): Promise<void> => {
    const { workspace } = await getWorkspace(tree);
    workspace.projects.forEach((project) => {
      ['polyfills.ts', 'test.ts'].forEach((filename) => {
        const path = `${project.root}/src/${filename}`;
        if (tree.exists(path)) {
          const polyfillsFile = tree.readText(path).replace(/\r\n/g, `\n`);
          const polyfillBlockStartIndex =
            polyfillsFile.indexOf(polyfillBlockStart);
          const polyfillBlockEndIndex = polyfillsFile.indexOf(polyfillBlockEnd);
          if (polyfillBlockStartIndex !== -1 && polyfillBlockEndIndex !== -1) {
            const changeStart = polyfillsFile.lastIndexOf(
              `/*`,
              polyfillBlockStartIndex
            );
            const changeEnd =
              polyfillsFile.indexOf(`*/`, polyfillBlockEndIndex) + 2;
            const change = tree.beginUpdate(path);
            change.remove(changeStart, changeEnd - changeStart);
            tree.commitUpdate(change);
          } else {
            const sourceFile = ts.createSourceFile(
              path,
              polyfillsFile,
              ts.ScriptTarget.Latest,
              true
            );
            // Find the expression that assigns the global property to the window object.
            const expression = sourceFile.statements.find((node) => {
              if (ts.isExpressionStatement(node)) {
                const expression = node.expression;
                if (ts.isBinaryExpression(expression)) {
                  const left = expression.left;
                  if (ts.isPropertyAccessExpression(left)) {
                    let leftExpression: ts.Expression = left.expression;
                    if (ts.isParenthesizedExpression(leftExpression)) {
                      leftExpression = leftExpression.expression;
                    }
                    if (
                      ts.isAsExpression(leftExpression) &&
                      ts.isIdentifier(leftExpression.expression) &&
                      leftExpression.expression.text === 'window' &&
                      left.name.text === 'global'
                    ) {
                      const right = expression.right;
                      if (ts.isIdentifier(right) && right.text === 'window') {
                        return true;
                      }
                    }
                  }
                }
              }
              return false;
            });
            if (expression) {
              const change = tree.beginUpdate(path);
              change.remove(expression.pos, expression.end - expression.pos);
              tree.commitUpdate(change);
            }
          }
        }
      });
    });
  };
}

export function updatePolyfillSchematic(): Rule {
  return chain([removePolyfillCode(), addPolyfillsConfig()]);
}
