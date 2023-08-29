import { VERSION as ANGULAR_VERSION } from '@angular/cli';
import {
  Tree,
  formatFiles,
  generateFiles,
  updateJson,
  workspaceRoot,
} from '@nx/devkit';
import { dasherize } from '@nx/devkit/src/utils/string-utils';
import { Schema as NgNewSchema } from '@schematics/angular/ng-new/schema';
import { findNodes } from '@schematics/angular/utility/ast-utils';

import { wrapAngularDevkitSchematic } from 'nx/src/adapter/ngcli-adapter';
import { getHoistedPackageVersion } from 'nx/src/plugins/js/lock-file/utils/package-json';
import { readPackageJson } from 'nx/src/project-graph/file-utils';
import * as ts from 'typescript';

import {
  findComponentClass,
  findNgModuleClass,
  readSourceFile,
} from '../../utils/ast-utils';
import {
  findDependenciesFromCode,
  findPeerDependencies,
} from '../../utils/find-dependencies';

import {
  CodeExampleSpaGeneratorConfig,
  CodeExampleSpaGeneratorSchema,
} from './schema';

const codeExamplesBasePath = `apps/code-examples/src/app/code-examples`;
const buildPath = `dist/libs/sdk/code-examples-sdk`;
const commonJsDependencies = {
  autonumeric: ['@skyux/ag-grid', '@skyux/autonumeric'],
  moment: ['@skyux/ag-grid', '@skyux/datetime'],
  'dom-autoscroller': ['@skyux/lookup', '@skyux/lists'],
};
const startingDependencies = [
  '@skyux/assets',
  '@skyux/core',
  '@skyux/i18n',
  '@skyux/icons',
  '@skyux/packages',
  '@skyux/theme',
];

function normalizeOptions(
  options: CodeExampleSpaGeneratorSchema
): CodeExampleSpaGeneratorConfig {
  return {
    ...options,
    project: `${dasherize(options.component)}-${dasherize(
      options.path.replaceAll('/', '-')
    )}`,
    projectPath: `${dasherize(options.component)}/${dasherize(options.path)}`,
  };
}

function findExampleModule(tree: Tree, config: CodeExampleSpaGeneratorConfig) {
  // Get the module file
  const exampleModuleFiles = tree
    .children(`${codeExamplesBasePath}/${config.projectPath}`)
    .filter((child) => child.endsWith('.module.ts'));
  if (exampleModuleFiles.length !== 1) {
    throw new Error(
      `Expected exactly one module file for ${config.projectPath} but found ${
        exampleModuleFiles.length
      }: ${exampleModuleFiles.join(', ')}`
    );
  }
  const exampleModuleFile = exampleModuleFiles[0];

  // Get the module class name
  const exampleModuleSource = readSourceFile(
    tree,
    `${codeExamplesBasePath}/${config.projectPath}/${exampleModuleFile}`
  );
  const exampleModuleClass = findNgModuleClass(exampleModuleSource);
  const exampleModuleClassName =
    exampleModuleClass?.classDeclaration.name?.getText();

  // Get the example component class name
  const exampleModuleExportsArray = exampleModuleClass?.properties[
    'exports'
  ] as ts.ArrayLiteralExpression;
  const exampleModuleExportIdentifiers =
    exampleModuleExportsArray.elements.filter(
      ts.isIdentifier
    ) as ts.Identifier[];
  const exampleComponentClassIdentifier = exampleModuleExportIdentifiers.filter(
    (identifier) => identifier.getText().endsWith('Component')
  )[0];
  const exampleComponentClassName = exampleComponentClassIdentifier.getText();

  // Get the import path for the example component.
  const exampleComponentImport = findNodes(
    exampleModuleSource,
    ts.SyntaxKind.ImportDeclaration
  ).filter((node) =>
    (node as ts.ImportDeclaration).getText().includes(exampleComponentClassName)
  )[0] as ts.ImportDeclaration;
  if (
    !exampleModuleClass ||
    !exampleModuleClassName ||
    !exampleComponentImport
  ) {
    throw new Error(
      `Could not find import for example component in ${config.projectPath}/${exampleModuleFile}`
    );
  }
  let exampleComponentFile = exampleComponentImport.moduleSpecifier.getText();
  // Remove quotes, add .ts extension.
  exampleComponentFile =
    exampleComponentFile.substring(1, exampleComponentFile.length - 1) + '.ts';

  // Get the example component source.
  const exampleComponentSource = readSourceFile(
    tree,
    `${codeExamplesBasePath}/${config.projectPath}/${exampleComponentFile}`
  );

  // Get the example component selector.
  const exampleComponent = findComponentClass(exampleComponentSource);
  if (!exampleComponent) {
    throw new Error(
      `Could not find Component decorator in ${config.projectPath}/${exampleComponentFile}`
    );
  }
  const exampleComponentSelector = (
    exampleComponent.properties['selector'] as ts.StringLiteral
  ).text;

  const hasTests = tree
    .children(`${codeExamplesBasePath}/${config.projectPath}`)
    .some((child) => child.endsWith('.spec.ts'));

  return {
    exampleComponentSelector,
    exampleModuleFile,
    exampleModuleClassName,
    hasTests,
  };
}

async function generateSpa(
  config: CodeExampleSpaGeneratorConfig,
  tree: Tree,
  exampleModuleClassName: string,
  exampleModuleFile: string,
  dependencies: string[],
  exampleComponentSelector: string,
  hasTests: boolean
) {
  const ngNew = wrapAngularDevkitSchematic('@schematics/angular', 'ng-new');
  const cdkAdd = wrapAngularDevkitSchematic('@angular/cdk', 'ng-add');
  const outputPath = `${buildPath}/for-github/${config.projectPath}`;

  if (tree.isFile(`${outputPath}/angular.json`)) {
    throw new Error(
      `The project build ${outputPath} already exists. Please delete it before running this schematic.`
    );
  }

  await ngNew(tree, {
    name: config.project,
    directory: outputPath,
    skipGit: true,
    skipInstall: true,
    skipTests: !hasTests,
    packageManager: 'npm',
    routing: false,
    strict: true,
    style: 'scss',
    version: ANGULAR_VERSION.full,
  } as NgNewSchema);
  await cdkAdd(tree, {
    project: config.project,
  });

  tree.delete(`${outputPath}/README.md`);
  tree
    .children(`${outputPath}/src/app`)
    .forEach((child) => tree.delete(`${outputPath}/src/app/${child}`));
  tree.delete(`${outputPath}/src/assets/.gitkeep`);
  tree.delete(`${outputPath}/src/favicon.ico`);

  // Update angular.json
  updateJson(tree, `${outputPath}/angular.json`, (json) => {
    delete json.projects[config.project].architect.build.configurations;
    delete json.projects[config.project].architect.build.defaultConfiguration;
    delete json.projects[config.project].architect.serve.configurations;
    delete json.projects[config.project].architect.serve.defaultConfiguration;
    if (!json.projects[config.project].architect.serve.options) {
      json.projects[config.project].architect.serve.options = {};
    }
    json.projects[
      config.project
    ].architect.serve.options.browserTarget = `${config.project}:build`;
    json.projects[config.project].architect.build.options.polyfills.push(
      '@skyux/packages/polyfills'
    );
    json.projects[config.project].architect.build.options.assets = [];
    json.projects[config.project].architect.build.options.buildOptimizer =
      false;
    json.projects[config.project].architect.build.options.optimization = false;
    json.projects[
      config.project
    ].architect.build.options.allowedCommonJsDependencies = [
      'fontfaceobserver',
      '@skyux/icons',
    ];
    Object.entries(commonJsDependencies).forEach(
      ([dependency, skyuxModules]) => {
        if (skyuxModules.some((module) => dependencies.includes(module))) {
          json.projects[
            config.project
          ].architect.build.options.allowedCommonJsDependencies.push(
            dependency
          );
        }
      }
    );

    if (hasTests) {
      json.projects[config.project].architect.test.options.polyfills.push(
        '@skyux/packages/polyfills'
      );
      json.projects[config.project].architect.test.options.assets = [];
    } else {
      delete json.projects[config.project].architect.test;
    }
    delete json.projects[config.project].schematics;
    return json;
  });

  // Update package.json
  updateJson(tree, `${outputPath}/package.json`, (json) => {
    const newDependencies = dependencies.filter((dependency) => {
      return (
        !json.dependencies[dependency] && !json.devDependencies[dependency]
      );
    });
    const skyuxVersion = `^${readPackageJson().version}`;
    newDependencies.forEach((dependency) => {
      if (dependency.startsWith('@skyux')) {
        if (tree.isFile(`node_modules/${dependency}/package.json`)) {
          json.dependencies[dependency] = `${getHoistedPackageVersion(
            dependency
          )}`;
        } else {
          json.dependencies[dependency] = skyuxVersion;
        }
      } else {
        json.dependencies[dependency] = `${getHoistedPackageVersion(
          dependency
        )}`;
      }
    });
    const sortedDependencies: Record<string, string> = {};
    Object.keys(json.dependencies)
      .sort((a, b) => {
        if (a.startsWith('@') && !b.startsWith('@')) {
          return -1;
        } else if (!a.startsWith('@') && b.startsWith('@')) {
          return 1;
        } else {
          return a.localeCompare(b, undefined, { sensitivity: 'base' });
        }
      })
      .forEach((key) => {
        sortedDependencies[key] = json.dependencies[key];
      });
    json.dependencies = sortedDependencies;
    if (!hasTests) {
      delete json.scripts.test;
      [
        '@types/jasmine',
        'jasmine-core',
        'karma',
        'karma-chrome-launcher',
        'karma-coverage',
        'karma-jasmine',
        'karma-jasmine-html-reporter',
      ].forEach((dependency) => {
        delete json.devDependencies[dependency];
      });
    }
    return json;
  });

  // Update tsconfig.json
  updateJson(tree, `${outputPath}/tsconfig.json`, (json) => {
    delete json.compileOnSave;
    json.compilerOptions.esModuleInterop = true;
    json.angularCompilerOptions.strictTemplates = true;
    return json;
  });

  if (!hasTests) {
    tree.delete(`${outputPath}/tsconfig.spec.json`);
  }

  // Append to .gitignore
  const gitignorePath = `${outputPath}/.gitignore`;
  const gitignore = tree.read(gitignorePath, 'utf-8');
  tree.write(gitignorePath, `${gitignore}\n\n.angular\n`);

  // Overwrite files with our own
  generateFiles(tree, `${__dirname}/files/project`, outputPath, {
    name: config.project,
    exampleModuleClassName,
    exampleModuleFile: `${exampleModuleFile}`.replace('.ts', ''),
    selector: exampleComponentSelector,
    projectPath: config.projectPath,
    dasherize,
    includeAgGrid: dependencies.includes('ag-grid-angular'),
  });
  return outputPath;
}

function generateHtmlLauncherFile(
  tree: Tree,
  outputPath: string,
  config: CodeExampleSpaGeneratorConfig
) {
  // Generate an HTML launcher file.
  const files: Record<string, string> = {};
  const getFiles = (path: string) => {
    tree.children(path).forEach((child) => {
      const filePath = `${path}/${child}`;
      if (tree.isFile(filePath)) {
        files[filePath.replace(`${outputPath}/`, '')] = `${tree.read(
          filePath,
          'utf-8'
        )}`;
      } else {
        getFiles(filePath);
      }
    });
  };
  getFiles(outputPath);
  generateFiles(tree, `${__dirname}/files/launcher`, `${buildPath}/launchers`, {
    files,
    name: config.project,
    jsonStringify: JSON.stringify,
  });
}

export async function codeExampleSpa(
  tree: Tree,
  options: CodeExampleSpaGeneratorSchema
) {
  const config = normalizeOptions(options);
  const {
    exampleModuleFile,
    exampleModuleClassName,
    exampleComponentSelector,
    hasTests,
  } = findExampleModule(tree, config);
  const exampleCodeDependencies = findDependenciesFromCode(
    tree,
    `${codeExamplesBasePath}/${config.projectPath}`
  );
  const exampleDependencies = findPeerDependencies(
    tree,
    exampleCodeDependencies.concat(startingDependencies)
  );

  // Create the basic SPA, including dependencies.
  const outputPath = await generateSpa(
    config,
    tree,
    exampleModuleClassName,
    exampleModuleFile,
    exampleDependencies,
    exampleComponentSelector,
    hasTests
  );

  // Copy code example component
  generateFiles(
    tree,
    `${workspaceRoot}/${codeExamplesBasePath}/${config.projectPath}`,
    `${outputPath}/src/app`,
    {}
  );

  // Format before generating launcher file.
  await formatFiles(tree);

  // Generate an HTML launcher file.
  generateHtmlLauncherFile(tree, outputPath, config);

  // Format again after generating launcher file.
  await formatFiles(tree);
}

export default codeExampleSpa;
