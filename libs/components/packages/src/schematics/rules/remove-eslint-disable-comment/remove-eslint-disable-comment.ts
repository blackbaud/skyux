import { UpdateRecorder } from '@angular-devkit/schematics';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';

import { visitProjectFiles } from '../../utility/visit-project-files';

interface Options {
  ruleNames: string[];
}

function removeComments(
  content: string,
  ruleNames: string[],
  recorder: UpdateRecorder,
  commentStartsWith: string,
  commentEndsWith: string,
): void {
  let nextComment = -1;
  let nextCommentOffset = 0;
  while (
    (nextComment = content.indexOf(commentStartsWith, nextCommentOffset)) > -1
  ) {
    const valueStart = content.indexOf(
      ' ',
      nextComment + commentStartsWith.length,
    );
    nextCommentOffset = content.indexOf(commentEndsWith, valueStart);
    const values = content
      .substring(valueStart + 1, nextCommentOffset)
      .split(/, */)
      .map((v) => v.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    if (values.every((value) => ruleNames.includes(value))) {
      // Remove the whole comment.
      recorder.remove(
        nextComment,
        nextCommentOffset - nextComment + commentEndsWith.trim().length,
      );
      if (content.charAt(nextComment - 1) === ' ') {
        recorder.remove(nextComment - 1, 1);
      }
    } else if (ruleNames.some((ruleName) => values.includes(ruleName))) {
      // Update the comment.
      recorder.remove(
        valueStart + 1,
        nextCommentOffset - valueStart - commentEndsWith.length,
      );
      const newValue = values.filter((v) => !ruleNames.includes(v)).join(', ');
      recorder.insertLeft(valueStart + 1, newValue);
    }
  }
}

export function removeEslintDisableComment(
  options: Options,
): (tree: Tree) => void {
  return (tree) => {
    const ruleNames = options.ruleNames
      .map((ruleName) => ruleName.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    visitProjectFiles(tree, '', (filePath) => {
      if (!filePath.endsWith('.ts')) {
        return;
      }

      const content = tree.readText(filePath);
      if (
        content.includes('eslint-disable') &&
        ruleNames.some((ruleName) => content.includes(ruleName))
      ) {
        const recorder = tree.beginUpdate(filePath);
        removeComments(content, ruleNames, recorder, '// eslint-disable', `\n`);
        removeComments(content, ruleNames, recorder, '/* eslint-disable', '*/');
        tree.commitUpdate(recorder);
      }
    });
  };
}
