import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import { Rule, chain } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { addPolyfillsConfig } from '../../../rules/add-polyfills-config';
import { getWorkspace } from '../../../utility/workspace';

const polyfillBlockStart = `* SKY UX POLYFILLS - DO NOT MODIFY THIS SECTION`;
const polyfillBlockEnd = `* END SKY UX POLYFILLS`;

function removePolyfillCode(
  projectName: string,
  project: ProjectDefinition
): Rule {
  return async (tree): Promise<Rule | void> => {
    // Saves a list of files that need to be checked for SKY UX polyfills.
    const polyfillsFiles = new Set<string>();

    // Saves a list of targets that use each polyfills file.
    const targetsWithPolyfills = new Map<string, Set<string>>();

    // Check each target for 'polyfills' configuration.
    for (const [targetName, target] of project.targets.entries()) {
      const files = [];

      // src/test.ts
      if (targetName === 'test' && target.options?.main) {
        files.push(target.options.main as string);
      }

      // src/polyfills.ts
      if (target.options?.polyfills) {
        files.push(target.options.polyfills as string);
      }

      for (const file of files) {
        // Save the file to the list of files that need to be checked.
        polyfillsFiles.add(file);

        // Save a list of targets that use each file.
        const set = targetsWithPolyfills.get(file);
        if (set) {
          set.add(targetName);
        } else {
          targetsWithPolyfills.set(file, new Set([targetName]));
        }
      }
    }

    // Loop through each file and remove our polyfill, if it exists.
    for (const polyfillsFile of polyfillsFiles) {
      if (tree.exists(polyfillsFile)) {
        const contents = tree.readText(polyfillsFile);
        const polyfillBlockStartIndex = contents.indexOf(polyfillBlockStart);
        const polyfillBlockEndIndex = contents.indexOf(polyfillBlockEnd);

        // Check for comment-block syntax.
        if (polyfillBlockStartIndex !== -1 && polyfillBlockEndIndex !== -1) {
          const changeStart = contents.lastIndexOf(
            `/*`,
            polyfillBlockStartIndex
          );
          const changeEnd = contents.indexOf(`*/`, polyfillBlockEndIndex) + 2;
          const change = tree.beginUpdate(polyfillsFile);
          change.remove(changeStart, changeEnd - changeStart);
          tree.commitUpdate(change);
        } else {
          const sourceFile = ts.createSourceFile(
            polyfillsFile,
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
            const change = tree.beginUpdate(polyfillsFile);
            change.remove(expression.pos, expression.end - expression.pos);
            tree.commitUpdate(change);
          } else {
            // The file doesn't include our polyfill, so remove it from the list of
            // targets that need the new polyfills config.
            targetsWithPolyfills.delete(polyfillsFile);
          }
        }
      }
    }

    // Only update the project config if our polyfill was found in the files.
    if (targetsWithPolyfills.size > 0) {
      // Flatten all targets into a single array of unique values.
      const targetsToUpdate = Array.from(
        new Set(
          Array.from(targetsWithPolyfills.values())
            .map((x) => Array.from(x.values()))
            .flat()
        )
      );

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
