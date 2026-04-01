import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../testing/scaffold';

describe('add-ai-skills', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  it('should copy skill files to .github/skills/', async () => {
    const tree = await createTestApp(runner, { projectName: 'my-app' });

    const resultTree = await runner.runSchematic(
      'add-ai-skills',
      { project: 'my-app' },
      tree,
    );

    // Verify skill files exist at workspace root.
    expect(
      resultTree.exists('.github/skills/migration-resolver/SKILL.md'),
    ).toBe(true);
    expect(
      resultTree.exists(
        '.github/skills/skyux-test-driven-development/SKILL.md',
      ),
    ).toBe(true);

    // Verify reference files are included.
    expect(
      resultTree.exists(
        '.github/skills/migration-resolver/references/angular-debugging.md',
      ),
    ).toBe(true);
    expect(
      resultTree.exists(
        '.github/skills/skyux-test-driven-development/references/angular-testing-patterns.md',
      ),
    ).toBe(true);

    // Verify eval files are excluded.
    expect(
      resultTree.exists(
        '.github/skills/migration-resolver/evals/test-academic.md',
      ),
    ).toBe(false);
    expect(
      resultTree.exists(
        '.github/skills/migration-resolver/evals/test-pressure-1.md',
      ),
    ).toBe(false);
  });

  it('should preserve file content without template interpolation', async () => {
    const tree = await createTestApp(runner, { projectName: 'my-app' });

    const resultTree = await runner.runSchematic(
      'add-ai-skills',
      { project: 'my-app' },
      tree,
    );

    const skillContent = resultTree.readContent(
      '.github/skills/migration-resolver/SKILL.md',
    );
    expect(skillContent).toContain(
      'ExpressionChangedAfterItHasBeenCheckedError',
    );
    expect(skillContent).toContain(
      '`TestbedHarnessEnvironment.documentRootLoader(fixture)`',
    );
  });

  it('should overwrite existing files on re-run', async () => {
    const tree = await createTestApp(runner, { projectName: 'my-app' });

    const firstTree = await runner.runSchematic(
      'add-ai-skills',
      { project: 'my-app' },
      tree,
    );

    const secondTree = await runner.runSchematic(
      'add-ai-skills',
      { project: 'my-app' },
      firstTree,
    );

    expect(
      secondTree.exists('.github/skills/migration-resolver/SKILL.md'),
    ).toBe(true);
  });
});
