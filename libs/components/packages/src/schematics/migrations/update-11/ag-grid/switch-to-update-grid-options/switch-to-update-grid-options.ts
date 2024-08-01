import { Tree } from '@angular-devkit/schematics';

export function switchToUpdateGridOptions(tree: Tree, path: string): void {
  const content = tree.readText(path);
  const recorder = tree.beginUpdate(path);

  const setQuickFilterMatches = content.matchAll(
    /(?<=api[a-z]*)\.setQuickFilter\((.*?)\)/gi,
  );
  for (const instance of setQuickFilterMatches) {
    recorder.remove(instance.index, instance[0].length);
    recorder.insertRight(
      instance.index,
      `.updateGridOptions({ quickFilterText: ${instance[1]} })`,
    );
  }

  tree.commitUpdate(recorder);
}
