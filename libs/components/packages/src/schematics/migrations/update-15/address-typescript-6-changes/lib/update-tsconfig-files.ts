import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { posix } from 'node:path';

import { JsonFile } from '../../../../utility/json-file';

import { TsconfigInfo, TsconfigModel } from './tsconfig-model';

const DEPRECATED_TARGETS = new Set(['es3', 'es5']);
const DEPRECATED_MODULES = new Set(['none', 'amd', 'umd', 'system']);
const DEPRECATED_MODULE_RESOLUTIONS = new Set(['node10', 'classic', 'node']);

export function updateTsconfigFiles(
  tree: Tree,
  model: TsconfigModel,
  context: SchematicContext,
): void {
  for (const config of model.getAll()) {
    if (config.inNodeModules) {
      continue;
    }

    warnAboutNodeModulesBaseUrl(context, model, config);
    warnAboutDeprecatedValues(context, config);

    const json = new JsonFile(tree, config.path);

    rebasePaths(json, model, config);
    removeBaseUrl(json, config);
    removeDeprecatedOptions(json);
    removeDefaultMatchingOptions(json, model, config);
  }
}

function rebasePaths(
  json: JsonFile,
  model: TsconfigModel,
  config: TsconfigInfo,
): void {
  if (!config.ownPaths) {
    return;
  }

  const effectiveBaseUrl = model.getEffectiveBaseUrl(config);
  if (!effectiveBaseUrl) {
    return;
  }

  const baseUrlAbs = posix.resolve(
    effectiveBaseUrl.definedIn.dir,
    effectiveBaseUrl.value,
  );

  for (const [alias, values] of Object.entries(config.ownPaths)) {
    if (!Array.isArray(values)) {
      continue;
    }

    const newValues = values.map((value) =>
      rebasePathValue(value, baseUrlAbs, config.dir),
    );

    if (JSON.stringify(newValues) !== JSON.stringify(values)) {
      json.modify(['compilerOptions', 'paths', alias], newValues);
    }
  }
}

function rebasePathValue(
  value: string,
  baseUrlAbs: string,
  configDir: string,
): string {
  const needsRewrite = !value.startsWith('.') || baseUrlAbs !== configDir;
  if (!needsRewrite) {
    return value;
  }

  const targetAbs = posix.resolve(baseUrlAbs, value);
  const rebased = posix.relative(configDir, targetAbs);

  return rebased.startsWith('.') ? rebased : `./${rebased}`;
}

function removeBaseUrl(json: JsonFile, config: TsconfigInfo): void {
  if (config.ownBaseUrl !== undefined) {
    json.remove(['compilerOptions', 'baseUrl']);
  }
}

function removeDeprecatedOptions(json: JsonFile): void {
  json.remove(['compilerOptions', 'downlevelIteration']);
  json.remove(['compilerOptions', 'outFile']);
  removeIfEquals(json, 'alwaysStrict', false);
  removeIfEquals(json, 'esModuleInterop', false);
  removeIfEquals(json, 'allowSyntheticDefaultImports', false);
}

function removeDefaultMatchingOptions(
  json: JsonFile,
  model: TsconfigModel,
  config: TsconfigInfo,
): void {
  removeIfEquals(json, 'strict', true);
  removeIfEquals(json, 'alwaysStrict', true);
  removeIfEquals(json, 'esModuleInterop', true);
  removeIfEquals(json, 'allowSyntheticDefaultImports', true);

  const types = json.get(['compilerOptions', 'types']);
  if (Array.isArray(types) && types.length === 0) {
    json.remove(['compilerOptions', 'types']);
  }

  const moduleResolution = json.get(['compilerOptions', 'moduleResolution']);
  if (
    typeof moduleResolution === 'string' &&
    moduleResolution.toLowerCase() === 'bundler'
  ) {
    const effectiveModule = model.getEffectiveOption(config, 'module');
    if (
      typeof effectiveModule === 'string' &&
      effectiveModule.toLowerCase() === 'preserve'
    ) {
      json.remove(['compilerOptions', 'moduleResolution']);
    }
  }
}

function removeIfEquals(json: JsonFile, option: string, value: unknown): void {
  if (json.get(['compilerOptions', option]) === value) {
    json.remove(['compilerOptions', option]);
  }
}

function warnAboutNodeModulesBaseUrl(
  context: SchematicContext,
  model: TsconfigModel,
  config: TsconfigInfo,
): void {
  const effective = model.getEffectiveBaseUrl(config);
  if (effective?.definedIn.inNodeModules) {
    context.logger.warn(
      `"${config.path}" inherits "baseUrl" from "${effective.definedIn.path}" in node_modules, ` +
        `which cannot be edited automatically. Add "baseUrl": null to "${config.path}" or update its imports manually.`,
    );
  }
}

function warnAboutDeprecatedValues(
  context: SchematicContext,
  config: TsconfigInfo,
): void {
  warnIfDeprecated(context, config, 'target', DEPRECATED_TARGETS);
  warnIfDeprecated(context, config, 'module', DEPRECATED_MODULES);
  warnIfDeprecated(
    context,
    config,
    'moduleResolution',
    DEPRECATED_MODULE_RESOLUTIONS,
  );
}

function warnIfDeprecated(
  context: SchematicContext,
  config: TsconfigInfo,
  option: string,
  deprecatedValues: Set<string>,
): void {
  const value = config.json.get(['compilerOptions', option]);
  if (typeof value === 'string' && deprecatedValues.has(value.toLowerCase())) {
    context.logger.warn(
      `"${config.path}": "compilerOptions.${option}": "${value}" is deprecated in TypeScript 6 and should be updated manually.`,
    );
  }
}
