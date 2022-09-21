import { readProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import { libraryGenerator } from '@nrwl/workspace';

import { createTree } from 'nx/src/generators/testing-utils/create-tree';
import { updateProjectConfiguration } from 'nx/src/generators/utils/project-configuration';

import { getGeneratorDefaults } from './nx-generator-utils';
import { updateJson } from './update-json';

describe('nx-generator-utils', () => {
  it('should getGeneratorDefaults', async () => {
    const emptyTree = createTree();
    const empty = getGeneratorDefaults(
      emptyTree,
      'nx',
      'generator',
      'my-project'
    );
    expect(empty).toEqual({});
    const tree = createTreeWithEmptyV1Workspace();
    updateJson(tree, 'nx.json', (json) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (json as any)['generators'] = {
        nx: {
          generator: {
            setting1: 'my-value',
          },
        },
        'nx:generator': {
          setting2: 'my-value2',
        },
      };
      return json;
    });
    await libraryGenerator(tree, {
      name: 'my-library',
    });
    const projectConfig = readProjectConfiguration(tree, 'my-library');
    projectConfig.generators = {
      nx: {
        generator: {
          setting3: 'my-value3',
        },
      },
      'nx:generator': {
        setting4: 'my-value4',
      },
    };
    updateProjectConfiguration(tree, 'my-library', projectConfig);
    const defaults = getGeneratorDefaults(
      tree,
      'nx',
      'generator',
      'my-library'
    );
    expect(defaults).toEqual({
      setting1: 'my-value',
      setting2: 'my-value2',
      setting3: 'my-value3',
      setting4: 'my-value4',
    });
  });
});
