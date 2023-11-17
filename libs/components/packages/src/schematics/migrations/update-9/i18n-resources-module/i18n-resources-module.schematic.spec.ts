import { externalSchematic } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { resolve } from 'path';

import { createTestLibrary } from '../../../testing/scaffold';

jest.mock('@angular-devkit/schematics', () => {
  const original = jest.requireActual('@angular-devkit/schematics');
  return {
    ...original,
    externalSchematic: jest.fn(),
  };
});

describe('i18n-resources-module.schematic', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    resolve(__dirname, '../../migration-collection.json'),
  );

  async function setupTest(options?: {
    moduleContents?: string;
    moduleFilePath?: string;
    packageJson?: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
  }) {
    const tree = await createTestLibrary(runner, {
      projectName: 'my-lib',
    });

    tree.overwrite(
      '/package.json',
      JSON.stringify(
        options?.packageJson ?? { dependencies: { '@skyux/i18n': '1.0.0' } },
      ),
    );

    tree.create(
      options?.moduleFilePath ??
        '/projects/my-lib/src/lib/modules/shared/my-lib-resources.module.ts',
      options?.moduleContents ??
        `/**
* NOTICE: DO NOT MODIFY THIS FILE!
* The contents of this file were automatically generated by
* the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/my-lib' schematic.
* To update this file, simply rerun the command.
*/

import { NgModule } from '@angular/core';
import {
  getLibStringForLocale,
  SkyAppLocaleInfo,
  SkyI18nModule,
  SkyLibResources,
  SkyLibResourcesProvider,
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

const RESOURCES: { [locale: string]: SkyLibResources } = {
  'EN-US': {"hello_world":{"message":"Hello, world!"}},
};

export class MyLibResourcesProvider implements SkyLibResourcesProvider {
  public getString(localeInfo: SkyAppLocaleInfo, name: string): string {
    return getLibStringForLocale(RESOURCES, localeInfo.locale, name);
  }
}

/**
* Import into any component library module that needs to use resource strings.
*/
@NgModule({
  exports: [SkyI18nModule],
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: MyLibResourcesProvider,
    multi: true
  }]
})
export class MyLibResourcesModule { }
`,
    );

    const spies = {
      externalSchematic: (externalSchematic as jest.Mock).mockImplementation(
        () => () => undefined,
      ),
    };

    return {
      runSchematic: () =>
        runner.runSchematic('i18n-resources-module', {}, tree),
      spies,
      tree,
    };
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should run @skyux/i18n:lib-resources-module schematic', async () => {
    const { runSchematic, spies } = await setupTest();

    await runSchematic();

    expect(spies.externalSchematic).toHaveBeenCalledWith(
      '@skyux/i18n',
      'lib-resources-module',
      {
        name: 'lib/modules/shared/my-lib',
        project: 'my-lib',
      },
    );
  });

  it('should abort if @skyux/i18n not installed', async () => {
    const { runSchematic, spies } = await setupTest({
      packageJson: {},
    });

    await runSchematic();

    expect(spies.externalSchematic).not.toHaveBeenCalled();
  });

  it('should run schematic for projects without a `sourceRoot`', async () => {
    const { runSchematic, spies, tree } = await setupTest({
      // Module path doesn't match what's provided in the comment block at the top of the resources module.
      moduleFilePath:
        '/projects/my-lib/src/lib/src/src/foobar/modules/shared/my-lib-resources.module.ts',
    });

    // Remove `sourceRoot` property.
    const angularJson = JSON.parse(tree.readText('/angular.json'));
    delete angularJson.projects['my-lib'].sourceRoot;
    tree.overwrite('/angular.json', JSON.stringify(angularJson));

    await runSchematic();

    expect(spies.externalSchematic).toHaveBeenCalledWith(
      '@skyux/i18n',
      'lib-resources-module',
      {
        name: 'lib/src/src/foobar/modules/shared/my-lib',
        project: 'my-lib',
      },
    );
  });
});
