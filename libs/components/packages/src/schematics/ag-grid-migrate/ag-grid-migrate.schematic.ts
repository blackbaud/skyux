import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { spawnSync } from 'child_process';
import { platform } from 'os';

import { Schema } from './schema';

const AG_GRID_MIGRATIONS = ['31.0.0', '31.1.0', '31.2.1', '31.3.2'];
const AG_GRID_VERSION = AG_GRID_MIGRATIONS.slice().pop();

export default function (options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    let { sourceRoot } = options;
    sourceRoot ||= '.';
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
      ['install', '--no-save', `@ag-grid-community/cli@${AG_GRID_VERSION}`],
      {
        stdio: 'ignore',
        windowsVerbatimArguments: true,
      },
    );
    for (const migration of AG_GRID_MIGRATIONS) {
      const patchVersionZero =
        migration.split('.').slice(0, 2).join('.') + '.0';
      const cmdArgs = [
        'node_modules/@ag-grid-community/cli/index.cjs',
        'migrate',
        `--to=${patchVersionZero}`,
        '--allow-dirty',
        ...agGridFiles,
      ];
      context.logger.info(``);
      context.logger.info(`⏳ Migrating to AG Grid ${migration}`);
      context.logger.info(``);
      spawnSync('node', cmdArgs, {
        shell: true,
        stdio: 'inherit',
        windowsVerbatimArguments: true,
        argv0: 'npx',
      });
    }
    spawnSync(npm, ['remove', `@ag-grid-community/cli`], {
      stdio: 'ignore',
    });
    context.logger.info(
      `🏁 Done running migrations for AG Grid ${AG_GRID_VERSION}`,
    );
  };
}
