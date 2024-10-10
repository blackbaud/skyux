import {
  E2eTestRunner,
  UnitTestRunner,
  applicationGenerator,
  libraryGenerator,
} from '@nx/angular/generators';
import { Tree } from '@nx/devkit';
import { Linter } from '@nx/eslint';

export async function createTestApplication(
  tree: Tree,
  options: { name: string; e2eTestRunner?: boolean; unitTestRunner?: boolean },
): Promise<void> {
  await applicationGenerator(tree, {
    name: options.name,
    skipPackageJson: true,
    directory: `apps/${options.name}`,
    e2eTestRunner: options.e2eTestRunner
      ? E2eTestRunner.Cypress
      : E2eTestRunner.None,
    linter: Linter.None,
    unitTestRunner: options.unitTestRunner
      ? UnitTestRunner.Jest
      : UnitTestRunner.None,
  });
}

export async function createTestLibrary(
  tree: Tree,
  options: { name: string },
): Promise<void> {
  await libraryGenerator(tree, {
    name: options.name,
    skipPackageJson: true,
    directory: `libs/${options.name}`,
    linter: Linter.None,
    unitTestRunner: UnitTestRunner.None,
  });
}
