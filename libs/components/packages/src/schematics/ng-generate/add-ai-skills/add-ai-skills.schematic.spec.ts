import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

import { createTestApp } from '../../testing/scaffold';

describe('add-ai-skills', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  it('should copy all skill files to .github/skills/', async () => {
    const tree = await createTestApp(runner, { projectName: 'my-app' });

    const resultTree = await runner.runSchematic('add-ai-skills', {}, tree);

    // Verify all SKILL.md files exist.
    expect(
      resultTree.exists('.github/skills/skyux-migration-debugger/SKILL.md'),
    ).toBe(true);
    expect(
      resultTree.exists(
        '.github/skills/skyux-test-driven-development/SKILL.md',
      ),
    ).toBe(true);
    expect(
      resultTree.exists(
        '.github/skills/skyux-verification-before-completion/SKILL.md',
      ),
    ).toBe(true);
    expect(
      resultTree.exists('.github/skills/skyux-project-modernization/SKILL.md'),
    ).toBe(true);

    // Verify all skyux-migration-debugger reference files are included.
    expect(
      resultTree.exists(
        '.github/skills/skyux-migration-debugger/references/angular-debugging.md',
      ),
    ).toBe(true);
    expect(
      resultTree.exists(
        '.github/skills/skyux-migration-debugger/references/condition-based-waiting.md',
      ),
    ).toBe(true);
    expect(
      resultTree.exists(
        '.github/skills/skyux-migration-debugger/references/defense-in-depth.md',
      ),
    ).toBe(true);
    expect(
      resultTree.exists(
        '.github/skills/skyux-migration-debugger/references/root-cause-tracing.md',
      ),
    ).toBe(true);

    // Verify all skyux-project-modernization reference files are included.
    expect(
      resultTree.exists(
        '.github/skills/skyux-project-modernization/references/available-schematics.md',
      ),
    ).toBe(true);
    expect(
      resultTree.exists(
        '.github/skills/skyux-project-modernization/references/deprecated-patterns.md',
      ),
    ).toBe(true);
    expect(
      resultTree.exists(
        '.github/skills/skyux-project-modernization/references/available-harnesses.md',
      ),
    ).toBe(true);

    // Verify all TDD reference files are included.
    expect(
      resultTree.exists(
        '.github/skills/skyux-test-driven-development/references/angular-testing-patterns.md',
      ),
    ).toBe(true);
    expect(
      resultTree.exists(
        '.github/skills/skyux-test-driven-development/references/testing-antipatterns.md',
      ),
    ).toBe(true);
  });

  it('should preserve file content without template interpolation', async () => {
    const tree = await createTestApp(runner, { projectName: 'my-app' });

    const resultTree = await runner.runSchematic('add-ai-skills', {}, tree);

    const skillContent = resultTree.readContent(
      '.github/skills/skyux-migration-debugger/SKILL.md',
    );
    expect(skillContent).toContain(
      'ExpressionChangedAfterItHasBeenCheckedError',
    );
    expect(skillContent).toContain(
      '`TestbedHarnessEnvironment.documentRootLoader(fixture)`',
    );
  });

  it('should preserve file content for TDD skill without template interpolation', async () => {
    const tree = await createTestApp(runner, { projectName: 'my-app' });

    const resultTree = await runner.runSchematic('add-ai-skills', {}, tree);

    const tddContent = resultTree.readContent(
      '.github/skills/skyux-test-driven-development/SKILL.md',
    );
    // Verify Mermaid diagram survives (contains brackets and special chars).
    expect(tddContent).toContain('flowchart LR');
    // Verify backtick-heavy code blocks are preserved.
    expect(tddContent).toContain('`Sky*Harness`');
  });

  it('should preserve user-owned files in .github/skills/', async () => {
    const tree = await createTestApp(runner, { projectName: 'my-app' });

    // Simulate a user-owned skill file that exists before running the schematic.
    tree.create('.github/skills/my-custom-skill/SKILL.md', '# My Custom Skill');

    const resultTree = await runner.runSchematic('add-ai-skills', {}, tree);

    // User file should still exist.
    expect(resultTree.exists('.github/skills/my-custom-skill/SKILL.md')).toBe(
      true,
    );
    expect(
      resultTree.readContent('.github/skills/my-custom-skill/SKILL.md'),
    ).toBe('# My Custom Skill');
  });

  it('should list all modernization schematics from collection.json', async () => {
    const collectionPath = require.resolve('../../../../collection.json');
    const collection = JSON.parse(readFileSync(collectionPath, 'utf-8'));
    const allSchematics = Object.keys(collection.schematics);

    // These schematics are setup/infrastructure, not modernization.
    const excluded = [
      'ng-add',
      'add-skyux-to-project',
      'add-ag-grid-styles',
      'add-ai-skills',
    ];

    const modernizationSchematics = allSchematics.filter(
      (name) => !excluded.includes(name),
    );

    const tree = await createTestApp(runner, { projectName: 'my-app' });
    const resultTree = await runner.runSchematic('add-ai-skills', {}, tree);
    const content = resultTree.readContent(
      '.github/skills/skyux-project-modernization/references/available-schematics.md',
    );

    const missing = modernizationSchematics.filter(
      (name) => !content.includes(name),
    );

    if (missing.length > 0) {
      fail(
        `These schematics exist in collection.json but are missing from available-schematics.md:\n${missing.join('\n')}`,
      );
    }
  });

  it('should list all exported harnesses from the monorepo', async () => {
    // Scan all testing public-api.ts files for exported harness classes.
    const componentsRoot = resolve(__dirname, '../../../../../../');
    const harnessesByPackage: Record<string, string[]> = {};

    for (const pkg of readdirSync(componentsRoot)) {
      const testingApi = join(
        componentsRoot,
        pkg,
        'testing',
        'src',
        'public-api.ts',
      );
      try {
        if (!statSync(testingApi).isFile()) continue;
      } catch {
        continue;
      }

      const apiContent = readFileSync(testingApi, 'utf-8');
      const harnessExports = apiContent
        .match(/export\s*\{[^}]*\}/gs)
        ?.flatMap((block) => {
          const names = block.match(/\b(Sky\w+Harness)\b/g) || [];
          return names.filter(
            (n) => !n.endsWith('HarnessFilters') && !n.endsWith('Harnesses'),
          );
        });

      if (harnessExports?.length) {
        harnessesByPackage[pkg] = [...new Set(harnessExports)];
      }
    }

    const allHarnesses = Object.values(harnessesByPackage).flat();

    const tree = await createTestApp(runner, { projectName: 'my-app' });
    const resultTree = await runner.runSchematic('add-ai-skills', {}, tree);
    const content = resultTree.readContent(
      '.github/skills/skyux-project-modernization/references/available-harnesses.md',
    );

    const missing = allHarnesses.filter((name) => !content.includes(name));

    if (missing.length > 0) {
      fail(
        `These harnesses are exported from the monorepo but missing from available-harnesses.md:\n${missing.join('\n')}`,
      );
    }
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
      secondTree.exists('.github/skills/skyux-migration-debugger/SKILL.md'),
    ).toBe(true);
  });
});
