import { storybookConfigurationGenerator } from '@nx/angular/generators';
import { configurationGenerator } from '@nx/cypress';
import { getProjects } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Linter } from '@nx/eslint';

import {
  getE2eProjects,
  getProjectTypeBase,
  getStorybookProject,
  getStorybookProjects,
} from './get-projects';
import { createTestApplication, createTestLibrary } from './testing';

describe('some-or-all-projects', () => {
  it('should get someOrAllE2eProjects', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.write('.gitignore', '#');
    for (let i = 1; i <= 3; i++) {
      await createTestApplication(tree, {
        name: `cypress${i}`,
      });
      await configurationGenerator(tree, {
        project: `cypress${i}`,
        baseUrl: 'https://example.com',
        skipFormat: true,
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
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.write('.gitignore', '#');
    for (let i = 1; i <= 3; i++) {
      await createTestApplication(tree, {
        name: `test-app${i}`,
      });
      await storybookConfigurationGenerator(tree, {
        generateStories: false,
        linter: Linter.None,
        project: `test-app${i}`,
        interactionTests: false,
        skipFormat: true,
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
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.write('.gitignore', '#');
    await createTestApplication(tree, {
      name: 'test-app',
    });
    await createTestLibrary(tree, { name: 'test-lib' });
    const projects = getProjects(tree);
    expect(projects.get('test-app')).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(getProjectTypeBase(projects.get('test-app')!)).toEqual('app');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(getProjectTypeBase(projects.get('test-lib')!)).toEqual('lib');
  });

  it('should error when getStorybookProject is called without a project name', () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    expect(() => getStorybookProject(tree, {})).toThrow(
      new Error('Project name not specified'),
    );
  });
});
