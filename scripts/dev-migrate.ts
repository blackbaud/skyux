import { existsSync, readJson, writeJson } from 'fs-extra';

import { hardenPackageJsonDependencies } from './lib/harden-package-json-dependencies';
import { fixCrossvent } from './migrations/fix-crossvent';
import { fixEslintNumericService } from './migrations/fix-eslint-numeric-service';
import { fixSchematicsTestScaffolding } from './migrations/fix-schematics-test-scaffolding';
import { isGitClean } from './utils/git-utils';
import { runCommand } from './utils/spawn';

async function removeUnwantedMigrations() {
  const migrationsJson = await readJson('migrations.json');
  migrationsJson.migrations = migrationsJson.migrations.filter((x: any) => {
    return ![
      'opt-out-testbed-teardown',
      'migration-v13-testbed-teardown',
    ].includes(x.name);
  });

  await writeJson('migrations.json', migrationsJson);
}

async function tryNxCommand(command: string, args: string[] = []) {
  const commonArgs = [
    '--all',
    '--parallel',
    '--max-parallel=5',
    '--exclude=ci',
  ];

  try {
    await runCommand('npx', [
      'nx',
      'run-many',
      `--target=${command}`,
      ...commonArgs,
      ...args,
    ]);
  } catch (err) {
    console.error(` [!] Nx target "${command}" failed.`, err);
  }
}

async function migrate() {
  try {
    if (!(await isGitClean({ compareAgainstRemote: true }))) {
      throw new Error(
        'Local changes detected. Push or stash the changes and try again.'
      );
    }

    if (!existsSync('migrations.json')) {
      await runCommand('npm', ['ci']);

      // Uninstall packages that cause problems during the migration.
      // See: https://github.com/nrwl/nx/issues/3186
      // See: https://github.com/nrwl/nx/issues/9388
      await runCommand('npm', ['uninstall', '@nrwl/cli', '@nrwl/tao']);

      await runCommand('npx', ['nx', 'migrate', 'latest']);

      await removeUnwantedMigrations();

      await runCommand('npx', ['nx', 'migrate', '--run-migrations']);

      // Update Nx CLI global install.
      await runCommand('npm', ['install', '--global', 'nx@latest']);

      await Promise.all([
        fixCrossvent(),
        fixEslintNumericService(),
        fixSchematicsTestScaffolding(),
        hardenPackageJsonDependencies(),
        runCommand('./node_modules/.bin/ts-node', [
          '--project',
          './scripts/tsconfig.json',
          './scripts/check-library-missing-peers.ts',
          '--',
          '--fix',
        ]),
      ]);

      await runCommand('npx', ['prettier', '--write', '.']);
    } else {
      console.log('Migration has already been run. Skipping.');
    }

    // Run lint, build, and test.
    await tryNxCommand('lint', ['--silent', '--quiet']);
    await tryNxCommand('build');
    await tryNxCommand('postbuild');
    await tryNxCommand('test', [
      '--code-coverage=false',
      '--browsers=ChromeHeadless',
    ]);
    await tryNxCommand('posttest');

    console.log('Migration completed.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
