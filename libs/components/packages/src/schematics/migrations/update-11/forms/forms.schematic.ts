import { Rule } from '@angular-devkit/schematics';

import { visitProjectFiles } from '../../../utility/visit-project-files';

export default function (): Rule {
  return (tree) => {
    const stringReplace: Record<string, string> = {
      "from '@skyux/forms/lib/modules/file-attachment/file-validate-function';": `from '@skyux/forms';`,
    };

    visitProjectFiles(tree, '', (filePath, fileEntry) => {
      if (filePath.endsWith('.ts') && fileEntry) {
        const content = fileEntry.content.toString();
        const recorder = tree.beginUpdate(filePath);
        Object.entries(stringReplace).forEach(([oldString, newString]) => {
          const oldStringIndex = content.indexOf(oldString);
          if (oldStringIndex !== -1) {
            recorder.remove(oldStringIndex, oldString.length);
            recorder.insertLeft(oldStringIndex, newString);
          }
        });
        tree.commitUpdate(recorder);
      }
    });
  };
}
