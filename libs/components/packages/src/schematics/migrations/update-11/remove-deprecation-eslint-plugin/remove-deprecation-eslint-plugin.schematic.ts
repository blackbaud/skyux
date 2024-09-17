import { Rule, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { JsonFile } from '../../../utility/json-file';
import { visitProjectFiles } from '../../../utility/visit-project-files';

function modifyCodeComments(tree: Tree) {
  visitProjectFiles(tree, '', (path, entry) => {
    if (!path.endsWith('.ts')) {
      return;
    }
    const content = entry?.content.toString();
    if (!content) {
      return;
    }

    const recorder = tree.beginUpdate(path);

    if (content.includes('deprecation/deprecation')) {
      const instances = content.matchAll(/\bdeprecation\/deprecation\b/g);
      for (const instance of instances) {
        recorder.remove(instance.index, instance[0].length);
        recorder.insertRight(
          instance.index,
          '@typescript-eslint/no-deprecated',
        );
      }
    }

    tree.commitUpdate(recorder);
  });
}

function switchRuleReference(
  eslintConfig: JsonFile,
  rules?: {
    [key: string]: string | string[];
  },
  overrideIndex?: number,
): void {
  if (rules) {
    const deprecationRule = rules['deprecation/deprecation'];
    if (deprecationRule) {
      rules['@typescript-eslint/no-deprecated'] = deprecationRule;
      delete rules['deprecation/deprecation'];
      if (overrideIndex !== undefined) {
        eslintConfig.modify(['overrides', overrideIndex, 'rules'], rules);
      } else {
        eslintConfig.modify(['rules'], rules);
      }
    }
  }
}

function removePluginReference(
  eslintConfig: JsonFile,
  plugins?: string[],
  overrideIndex?: number,
): void {
  if (plugins) {
    plugins = plugins.filter((plugin) => plugin !== 'deprecation');

    if (overrideIndex !== undefined) {
      eslintConfig.modify(['overrides', overrideIndex, 'plugins'], plugins);
    } else {
      eslintConfig.modify(['plugins'], plugins);
    }
  }
}

/**
 * Remove the deprecation ESLint plugin as it is not compatible with ESLint 9. A new compatible rule is now set using `@typescript/eslint`
 */
export default function removeDeprecationPlugin(): Rule {
  return (tree, context) => {
    if (getPackageJsonDependency(tree, '@skyux-sdk/eslint-config') !== null) {
      const packageJsonPath = '/package.json';

      const filePath = '/.eslintrc.json';
      let eslintConfig: JsonFile | undefined;
      try {
        eslintConfig = new JsonFile(tree, filePath);
        const overrides = eslintConfig.get(['overrides']) as any[] | undefined;
        if (overrides) {
          overrides.forEach((_, index) => {
            if (eslintConfig) {
              const overridesRules = eslintConfig?.get([
                'overrides',
                index,
                'rules',
              ]);
              switchRuleReference(eslintConfig, overridesRules, index);

              const overridePlugins = eslintConfig?.get([
                'overrides',
                index,
                'plugins',
              ]);
              removePluginReference(eslintConfig, overridePlugins, index);
            }
          });
        }

        const baseRules = eslintConfig.get(['rules']) as
          | { [key: string]: string | string[] }
          | undefined;
        if (baseRules) {
          switchRuleReference(eslintConfig, baseRules);
        }

        const basePlugins = eslintConfig.get(['plugins']) as
          | string[]
          | undefined;
        if (basePlugins) {
          removePluginReference(eslintConfig, basePlugins);
        }

        modifyCodeComments(tree);
      } finally {
        removePackageJsonDependency(
          tree,
          'eslint-plugin-deprecation',
          packageJsonPath,
        );
      }
    }

    context.addTask(new NodePackageInstallTask());
  };
}
