import {
  applicationGenerator,
  libraryGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import { cypressProjectGenerator } from '@nrwl/cypress';
import { getProjects } from '@nrwl/devkit';
import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';

import {
  getE2eProjects,
  getProjectTypeBase,
  getStorybookProject,
  getStorybookProjects,
} from './get-projects';

describe('some-or-all-projects', () => {
  it('should get someOrAllE2eProjects', async () => {
    const tree = createTreeWithEmptyV1Workspace();
    for (let i = 1; i <= 3; i++) {
      await cypressProjectGenerator(tree, {
        name: `cypress${i}`,
        baseUrl: 'https://example.com',
      });
    }
    // Without specifying name.
    const projects = getE2eProjects(tree);
    expect(Array.from(projects.keys())).toEqual([
      'cypress1',
      'cypress2',
      'cypress3',
    ]);
    // Specifying one name.
    const singleProject = getE2eProjects(tree, 'cypress1');
    expect(Array.from(singleProject.keys())).toEqual(['cypress1']);
    // Specifying multiple names.
    const bothProjects = getE2eProjects(tree, 'cypress1,cypress2');
    expect(Array.from(bothProjects.keys())).toEqual(['cypress1', 'cypress2']);
  });

  it('should get someOrAllStorybookProjects', async () => {
    const tree = createTreeWithEmptyV1Workspace();
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
    const projects = getStorybookProjects(tree);
    expect(Array.from(projects.keys())).toEqual([
      'test-app1',
      'test-app2',
      'test-app3',
    ]);
    // Specifying one name.
    const singleProject = getStorybookProjects(tree, 'test-app1');
    expect(Array.from(singleProject.keys())).toEqual(['test-app1']);
    // Specifying multiple names.
    const bothProjects = getStorybookProjects(tree, 'test-app1,test-app2');
    expect(Array.from(bothProjects.keys())).toEqual(['test-app1', 'test-app2']);
  });

  it('should getProjectTypeBase', async () => {
    const tree = createTreeWithEmptyV1Workspace();
    tree.write('.gitignore', '#');
    await applicationGenerator(tree, { name: 'test-app' });
    await libraryGenerator(tree, { name: 'test-lib' });
    const projects = getProjects(tree);
    expect(projects.get('test-app')).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(getProjectTypeBase(projects.get('test-app')!)).toEqual('app');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(getProjectTypeBase(projects.get('test-lib')!)).toEqual('lib');
  });

  it('should error when getStorybookProject is called without a project name', () => {
    const tree = createTreeWithEmptyV1Workspace();
    expect(() => getStorybookProject(tree, {})).toThrowError(
      'Project name not specified'
    );
  });
});
