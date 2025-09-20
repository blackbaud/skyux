import { Tree } from '@angular-devkit/schematics';
import { FileVisitor } from '@angular-devkit/schematics/src/tree/interface';

const rootIgnore = ['dist', 'coverage'];
const alwaysIgnore = ['node_modules', '__skyux'];

export function visitProjectFiles(
  tree: Tree,
  projectPath: string,
  visitor: FileVisitor,
): void {
  tree.getDir(projectPath).visit((path, entry) => {
    if (
      path.includes('/.') ||
      rootIgnore.some((i) => path.startsWith(`/${i}/`)) ||
      alwaysIgnore.some((i) => path.includes(`/${i}/`))
    ) {
      return;
    }
    visitor(path, entry);
  });
}
