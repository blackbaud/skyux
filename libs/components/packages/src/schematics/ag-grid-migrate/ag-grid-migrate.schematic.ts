import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { spawnSync } from 'child_process';
import { platform } from 'os';

import { Schema } from './schema';

const AG_GRID_MIGRATION = '33.0.0';
const AG_GRID_VERSION = '33.3.2';

function getStartingVersion(sourceRoot: string): string | undefined {
  try {
    const content = spawnSync(
      'git',
      // eslint-disable-next-line @cspell/spellchecker
      ['cat-file', '--textconv', `HEAD:${sourceRoot}/package-lock.json`],
      {
        encoding: 'utf-8',
        stdio: 'pipe',
      },
    );
    const packageJson = JSON.parse(content.stdout);
    return packageJson.packages?.['node_modules/ag-grid-community']?.version;
  } catch (e) {
    return undefined;
  }
}

export default function (options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    let { sourceRoot } = options;
    sourceRoot ||= '.';
    const startingVersion = options.from ?? getStartingVersion(sourceRoot);
    if (!startingVersion) {
      return;
    }
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
      ['install', '--no-save', `@ag-grid-devtools/cli@~${AG_GRID_MIGRATION}`],
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
    spawnSync(npm, ['remove', `@ag-grid-devtools/cli`], {
      stdio: 'ignore',
    });
    context.logger.info(
      `🏁 Done running migrations for AG Grid ${AG_GRID_VERSION}`,
    );
  };
}
