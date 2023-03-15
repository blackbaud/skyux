import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import { Rule, chain } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { addPolyfillsConfig } from '../../../rules/add-polyfills-config';
import { getWorkspace } from '../../../utility/workspace';

const polyfillBlockStart = `* SKY UX POLYFILLS - DO NOT MODIFY THIS SECTION`;
const polyfillBlockEnd = `* END SKY UX POLYFILLS`;

function removePolyfillCode(
  projectName: string,
  project: ProjectDefinition
): Rule {
  return async (tree): Promise<Rule | void> => {
    const targetsToUpdate: string[] = [];

    // Check each target for 'polyfills' configuration.
    for (const [targetName, target] of project.targets.entries()) {
      const polyfillsFile = target.options?.polyfills;

      if (!polyfillsFile) {
        continue;
      }

      const path = `${project.root}${polyfillsFile}`;
      if (tree.exists(path)) {
        const contents = tree.readText(path).replace(/\r\n/g, `\n`);
        const polyfillBlockStartIndex = contents.indexOf(polyfillBlockStart);
        const polyfillBlockEndIndex = contents.indexOf(polyfillBlockEnd);
        if (polyfillBlockStartIndex !== -1 && polyfillBlockEndIndex !== -1) {
          const changeStart = contents.lastIndexOf(
            `/*`,
            polyfillBlockStartIndex
          );
          const changeEnd = contents.indexOf(`*/`, polyfillBlockEndIndex) + 2;
          const change = tree.beginUpdate(path);
          change.remove(changeStart, changeEnd - changeStart);
          tree.commitUpdate(change);
          targetsToUpdate.push(targetName);
        } else {
          const sourceFile = ts.createSourceFile(
            path,
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
            const change = tree.beginUpdate(path);
            change.remove(expression.pos, expression.end - expression.pos);
            tree.commitUpdate(change);
            targetsToUpdate.push(targetName);
          }
        }
      }
    }

    // Only update the project config if our polyfill was found in the
    // polyfill.ts/test.ts files.
    if (targetsToUpdate.length > 0) {
      return addPolyfillsConfig(projectName, targetsToUpdate);
    }
  };
}

/**
 * Removes SKY UX specific polyfills from 'src/polyfills.ts' and 'src/test.ts' files.
 * Adds '@skyux/packages/polyfills' to the affected project's configuration.
 */
export default function updatePolyfillSchematic(): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);
    const rules: Rule[] = [];

    for (const [projectName, project] of workspace.projects.entries()) {
      rules.push(removePolyfillCode(projectName, project));
    }

    return chain(rules);
  };
}
