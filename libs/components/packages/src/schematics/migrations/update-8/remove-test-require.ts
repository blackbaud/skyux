import { Rule } from '@angular-devkit/schematics';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { getWorkspace } from '../../utility/workspace';

export default function (): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);
    workspace.projects.forEach((project) => {
      if (tree.exists(`${project.root}/src/test.ts`)) {
        const source = ts.createSourceFile(
          `${project.root}/src/test.ts`,
          tree.readText(`${project.root}/src/test.ts`),
          ts.ScriptTarget.Latest,
          true
        );

        // Walk the AST and find the "declare const require: any;" statement.
        const requireStatement = source.statements.find((statement) => {
          return (
            ts.isVariableStatement(statement) &&
            statement.declarationList.declarations[0].name.getText() ===
              'require'
          );
        });

        // Walk the AST and find the "const context = require.context(...);" statement.
        const contextStatement = source.statements.find((statement) => {
          return (
            ts.isVariableStatement(statement) &&
            statement.declarationList.declarations[0].initializer &&
            ts.isCallExpression(
              statement.declarationList.declarations[0].initializer
            ) &&
            statement.declarationList.declarations[0].initializer.expression.getText() ===
              'require.context'
          );
        });

        // Walk the AST and find the "const testingContext = require.context(...);" statement wrapped in a try/catch.
        const testingContextStatement = source.statements.find((statement) => {
          return (
            ts.isTryStatement(statement) &&
            statement.tryBlock.statements[0] &&
            ts.isVariableStatement(statement.tryBlock.statements[0]) &&
            statement.tryBlock.statements[0].declarationList.declarations[0]
              .initializer &&
            ts.isCallExpression(
              statement.tryBlock.statements[0].declarationList.declarations[0]
                .initializer
            ) &&
            statement.tryBlock.statements[0].declarationList.declarations[0].initializer.expression.getText() ===
              'require.context'
          );
        });

        // If any of the statements exists, remove them.
        if (requireStatement || contextStatement || testingContextStatement) {
          const recorder = tree.beginUpdate(`${project.root}/src/test.ts`);
          if (requireStatement) {
            recorder.remove(
              requireStatement.pos,
              requireStatement.end - requireStatement.pos
            );
          }
          if (contextStatement) {
            recorder.remove(
              contextStatement.pos,
              contextStatement.end - contextStatement.pos
            );
          }
          if (testingContextStatement) {
            recorder.remove(
              testingContextStatement.pos,
              testingContextStatement.end - testingContextStatement.pos
            );
          }
          tree.commitUpdate(recorder);
        }
      }
    });
  };
}
