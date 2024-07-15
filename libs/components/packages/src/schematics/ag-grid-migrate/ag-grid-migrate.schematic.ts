import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { spawnSync } from 'child_process';
import { platform } from 'os';

import { Schema } from './schema';

const AG_GRID_VERSION = '31.3.2';
const AG_GRID_MIGRATION = '31.3.0';

function getStartingVersion(sourceRoot: string): string {
  const content = spawnSync(
    'git',
    ['cat-file', `HEAD:${sourceRoot}/package-lock.json`],
    {
      encoding: 'utf-8',
      stdio: 'pipe',
    },
  );
  const packageJson = JSON.parse(content.stdout);
  return packageJson['node_modules/ag-grid-community'].version;
}

export default function (options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    let { sourceRoot } = options;
    sourceRoot ||= '.';
    const startingVersion = options.from ?? getStartingVersion(sourceRoot);
    if (startingVersion === AG_GRID_VERSION) {
      context.logger.info(
        `✅ Already on AG Grid ${AG_GRID_VERSION}. No migration needed.`,
      );
      return;
    }

    context.logger.info(`🏁 Migrating AG Grid code in ${sourceRoot}...`);
    const files = spawnSync('git', ['ls-files', `${sourceRoot}/**/*.ts`])
      .stdout.toString()
      .split('\n')
      .filter(Boolean)
      .filter(
        (file) => !file.includes('node_modules') && !file.includes('__skyux'),
      );
    const agGridFiles = files.filter((file) => {
      if (!tree.exists(file)) {
        return false;
      }
      const content = tree.readText(file);
      return content?.includes('ag-grid');
    });
    if (agGridFiles.length === 0) {
      context.logger.info(`No AG Grid files found in ${sourceRoot}`);
      return;
    }
    const npm = platform() === 'win32' ? 'npm.cmd' : 'npm';
    spawnSync(
      npm,
      ['install', '--no-save', `@ag-grid-devtools/cli@${AG_GRID_VERSION}`],
      {
        stdio: 'ignore',
        windowsVerbatimArguments: true,
      },
    );
    const cmdArgs = [
      'node_modules/@ag-grid-devtools/cli/index.cjs',
      'migrate',
      `--from=${startingVersion}`,
      `--to=${AG_GRID_MIGRATION}`,
      '--allow-dirty',
      ...agGridFiles,
    ];
    context.logger.info(`⏳ Migrating to AG Grid ${AG_GRID_VERSION}...`);
    const output = context.debug ? 'inherit' : 'ignore';
    spawnSync('node', cmdArgs, {
      shell: true,
      stdio: ['ignore', output, output],
      windowsVerbatimArguments: true,
      argv0: 'npx',
    });
    spawnSync(npm, ['remove', `@ag-grid-community/cli`], {
      stdio: 'ignore',
    });
    context.logger.info(
      `🏁 Done running migrations for AG Grid ${AG_GRID_VERSION}`,
    );
  };
}
