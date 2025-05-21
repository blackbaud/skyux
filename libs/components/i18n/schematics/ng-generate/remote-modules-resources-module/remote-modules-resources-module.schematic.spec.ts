import { SchematicsException } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp, createTestLibrary } from '../../testing/scaffold';

import { Schema } from './schema';

const COLLECTION_PATH = path.resolve(__dirname, '../../collection.json');

describe('remote-modules-resources-module.schematic', () => {
  async function setup(options: {
    projectType: 'library' | 'application';
  }): Promise<{
    runSchematic: (schematicOptions: Schema) => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);

    const tree =
      options.projectType === 'library'
        ? await createTestLibrary(runner, {
            projectName: 'foo',
          })
        : await createTestApp(runner, {
            projectName: 'foo',
          });

    return {
      runSchematic: (schematicOptions: Schema) =>
        runner.runSchematic(
          'remote-modules-resources-module',
          schematicOptions,
          tree,
        ),
      tree,
    };
  }

  it('should generate resources module', async () => {
    const { runSchematic } = await setup({ projectType: 'application' });

    const tree = await runSchematic({
      project: 'foo',
    });

    expect(
      tree.readText('/src/remote-modules/assets/locales/resources_en_US.json'),
    ).toEqual('{}');

    expect(tree.readText('/src/remote-modules/shared/resources.module.ts'))
      .toEqual(`/* istanbul ignore file */
/**
 * NOTE: DO NOT MODIFY THIS FILE!
 * This file is handled by the @skyux/i18n library. To regenerate its contents,
 * run the following command:
 * \`\`\`
 * ng generate @skyux/i18n:remote-modules-resources-module
 * \`\`\`
 */
import { NgModule } from '@angular/core';
import {
  type SkyRemoteModulesResources,
  provideSkyRemoteModulesResources,
} from '@skyux/i18n';

import en_us_resources from '../assets/locales/resources_en_US.json';

const RESOURCES: Record<string, SkyRemoteModulesResources> = {
  'EN-US': en_us_resources,
};

/**
 * Import into a remote module or component that references resource strings.
 */
@NgModule({
  providers: [provideSkyRemoteModulesResources(RESOURCES)],
})
export class RemoteModulesResourcesModule {}
`);
  });

  it('should throw if project name not provided', async () => {
    const { runSchematic } = await setup({ projectType: 'application' });

    await expectAsync(
      runSchematic({
        project: undefined,
      }),
    ).toBeRejectedWith(new SchematicsException('A project name is required.'));
  });

  it('should throw for library projects', async () => {
    const { runSchematic } = await setup({ projectType: 'library' });

    await expectAsync(
      runSchematic({
        project: 'foo',
      }),
    ).toBeRejectedWith(
      new SchematicsException(
        'The project "foo" is not of type "application". Aborting.',
      ),
    );
  });

  it('should generate resources module', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    const defaultResourcesPath =
      '/src/remote-modules/assets/locales/resources_en_US.json';

    tree.create(defaultResourcesPath, '{ foo: true; }');

    const updatedTree = await runSchematic({
      project: 'foo',
    });

    expect(updatedTree.readText(defaultResourcesPath)).toEqual(
      '{ foo: true; }',
    );
  });

  it('should use "src" if sourceRoot undefined', async () => {
    const { runSchematic, tree } = await setup({ projectType: 'application' });

    const angularJson = JSON.parse(tree.readText('/angular.json'));
    delete angularJson.projects['foo'].sourceRoot;
    tree.overwrite('/angular.json', JSON.stringify(angularJson));

    const updatedTree = await runSchematic({
      project: 'foo',
    });

    expect(
      updatedTree.exists('/src/remote-modules/shared/resources.module.ts'),
    ).toEqual(true);
  });
});
