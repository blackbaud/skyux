import {
  applicationGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import { cypressProjectGenerator } from '@nrwl/cypress';
import { Linter } from '@nrwl/linter';

import { createTreeWithEmptyWorkspace } from 'nx/src/generators/testing-utils/create-tree-with-empty-workspace';

import {
  someOrAllE2eProjects,
  someOrAllStorybookProjects,
} from './some-or-all-projects';

describe('some-or-all-projects', () => {
  it('should get someOrAllE2eProjects', async () => {
    const tree = createTreeWithEmptyWorkspace(1);
    for (let i = 1; i <= 3; i++) {
      await cypressProjectGenerator(tree, {
        name: `cypress${i}`,
        baseUrl: 'https://example.com',
      });
    }
    // Without specifying name.
    const projects = someOrAllE2eProjects(tree);
    expect(Array.from(projects.keys())).toEqual([
      'cypress1',
      'cypress2',
      'cypress3',
    ]);
    // Specifying one name.
    const singleProject = someOrAllE2eProjects(tree, 'cypress1');
    expect(Array.from(singleProject.keys())).toEqual(['cypress1']);
    // Specifying multiple names.
    const bothProjects = someOrAllE2eProjects(tree, 'cypress1,cypress2');
    expect(Array.from(bothProjects.keys())).toEqual(['cypress1', 'cypress2']);
  });

  it('should get someOrAllStorybookProjects', async () => {
    const tree = createTreeWithEmptyWorkspace(1);
    tree.write('.gitignore', '#');
    for (let i = 1; i <= 3; i++) {
      await applicationGenerator(tree, { name: `test-app${i}` });
      await storybookConfigurationGenerator(tree, {
        configureCypress: false,
        generateCypressSpecs: false,
        generateStories: false,
        linter: Linter.None,
        name: `test-app${i}`,
      });
    }
    // Without specifying name.
    const projects = someOrAllStorybookProjects(tree);
    expect(Array.from(projects.keys())).toEqual([
      'test-app1',
      'test-app2',
      'test-app3',
    ]);
    // Specifying one name.
    const singleProject = someOrAllStorybookProjects(tree, 'test-app1');
    expect(Array.from(singleProject.keys())).toEqual(['test-app1']);
    // Specifying multiple names.
    const bothProjects = someOrAllStorybookProjects(
      tree,
      'test-app1,test-app2'
    );
    expect(Array.from(bothProjects.keys())).toEqual(['test-app1', 'test-app2']);
  });
});
