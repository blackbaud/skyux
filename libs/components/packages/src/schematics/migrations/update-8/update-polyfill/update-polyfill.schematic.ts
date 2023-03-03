import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import { Rule, chain } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { addPolyfillsConfig } from '../../../rules/add-polyfills-config';
import { getWorkspace } from '../../../utility/workspace';

const polyfillBlockStart = `* SKY UX POLYFILLS - DO NOT MODIFY THIS SECTION`;
const polyfillBlockEnd = `* END SKY UX POLYFILLS`;

function removePolyfillCode(project: ProjectDefinition): Rule {
  return async (tree): Promise<void> => {
    for (const target of project.targets.values()) {
      const polyfillsFile = target.options?.polyfills;
      if (!polyfillsFile) {
        continue;
      }

      const filePath = `${project.root}${polyfillsFile}`;

      if (tree.exists(filePath)) {
        const contents = tree.readText(filePath).replace(/\r\n/g, `\n`);
        const polyfillBlockStartIndex = contents.indexOf(polyfillBlockStart);
        const polyfillBlockEndIndex = contents.indexOf(polyfillBlockEnd);

        if (polyfillBlockStartIndex !== -1 && polyfillBlockEndIndex !== -1) {
          const changeStart = contents.lastIndexOf(
            `/*`,
            polyfillBlockStartIndex
          );
          const changeEnd = contents.indexOf(`*/`, polyfillBlockEndIndex) + 2;

          const change = tree.beginUpdate(filePath);
          change.remove(changeStart, changeEnd - changeStart);
          tree.commitUpdate(change);
        } else {
          const sourceFile = ts.createSourceFile(
            filePath,
            contents,
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
            const change = tree.beginUpdate(filePath);
            change.remove(expression.pos, expression.end - expression.pos);
            tree.commitUpdate(change);
          }
        }
      }
    }
  };
}

export default function updatePolyfillSchematic(): Rule {
  return async (tree) => {
    const rules: Rule[] = [];

    const { workspace } = await getWorkspace(tree);

    for (const [projectName, project] of workspace.projects.entries()) {
      rules.push(
        removePolyfillCode(project),
        addPolyfillsConfig(projectName, ['build', 'test'])
      );
    }

    return chain(rules);
  };
}
