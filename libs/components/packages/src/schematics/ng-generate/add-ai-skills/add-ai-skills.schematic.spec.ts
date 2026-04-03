import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../testing/scaffold';

describe('add-ai-skills', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  it('should copy skill files to .github/skills/', async () => {
    const tree = await createTestApp(runner, { projectName: 'my-app' });

    const resultTree = await runner.runSchematic('add-ai-skills', {}, tree);

    expect(
      resultTree.exists('.github/skills/skyux-update-debugger/SKILL.md'),
    ).toBe(true);
  });

  it('should preserve file content without template interpolation', async () => {
    const tree = await createTestApp(runner, { projectName: 'my-app' });

    const resultTree = await runner.runSchematic('add-ai-skills', {}, tree);

    const skillContent = resultTree.readContent(
      '.github/skills/skyux-update-debugger/SKILL.md',
    );
    expect(skillContent).toContain('documentRootLoader');
    expect(skillContent).toContain('ng-mocks');
  });

  it('should preserve user-owned files in .github/skills/', async () => {
    const tree = await createTestApp(runner, { projectName: 'my-app' });

    tree.create('.github/skills/my-custom-skill/SKILL.md', '# My Custom Skill');

    const resultTree = await runner.runSchematic('add-ai-skills', {}, tree);

    expect(resultTree.exists('.github/skills/my-custom-skill/SKILL.md')).toBe(
      true,
    );
    expect(
      resultTree.readContent('.github/skills/my-custom-skill/SKILL.md'),
    ).toBe('# My Custom Skill');
  });

  it('should overwrite existing files on re-run', async () => {
    const tree = await createTestApp(runner, { projectName: 'my-app' });

    const firstTree = await runner.runSchematic('add-ai-skills', {}, tree);

    const secondTree = await runner.runSchematic(
      'add-ai-skills',
      {},
      firstTree,
    );

    expect(
      secondTree.exists('.github/skills/skyux-update-debugger/SKILL.md'),
    ).toBe(true);
  });
});
