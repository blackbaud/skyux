/**
 * - Runs all Karma unit tests for affected projects in a single browser instance.
 * - BrowserStack also executes this file to run all Karma tests in various browsers.
 * - Non-Karma tests are executed normally using `nx affected:test`.
 */
import {
  existsSync,
  readJson,
  removeSync,
  writeFile,
  writeJson,
} from 'fs-extra';
import { join } from 'path';

import { getCommandOutput, runCommand } from './utils/spawn';

// Always ignore these projects for test.
const IGNORE_PROJECTS = ['ci'];

const TEST_ENTRY_FILE = join(process.cwd(), '__test-affected.ts');
const TEST_TSCONFIG_FILE = join(process.cwd(), '__tsconfig.test-affected.json');

async function getAngularJson() {
  return readJson(join(process.cwd(), 'angular.json'));
}

/**
 * Returns affected projects for a given architect target.
 * @param {string} target One of build, test, lint, etc.
 * @returns An array of project names.
 */
async function getAffectedProjects(target: string) {
  const affectedStr = await getCommandOutput('npx', [
    'nx',
    'print-affected',
    `--target=${target}`,
    '--select=tasks.target.project',
  ]);

  if (!affectedStr) {
    return [];
  }

  return affectedStr
    .split(', ')
    .filter(
      (project) =>
        !project.endsWith('-testing') && !IGNORE_PROJECTS.includes(project)
    );
}

async function getUnaffectedProjects(
  affectedProjects: string[],
  angularJson: any
) {
  return Object.keys(angularJson.projects).filter(
    (project) =>
      !affectedProjects.includes(project) && !project.endsWith('-testing')
  );
}

async function getAffectedProjectsForTest(
  angularJson: any,
  onlyComponents: boolean
) {
  const projects = await getAffectedProjects('test');

  const karma: string[] = [];
  const jest: string[] = [];

  projects.forEach((project) => {
    if (
      !onlyComponents ||
      (onlyComponents &&
        angularJson.projects[project].projectType === 'library')
    ) {
      if (
        angularJson.projects[project].architect.test.builder ===
        '@angular-devkit/build-angular:karma'
      ) {
        karma.push(project);
      } else {
        jest.push(project);
      }
    }
  });

  return {
    karma,
    jest,
  };
}

async function createTempTestingFiles(
  karmaProjects: string[],
  angularJson: any
) {
  let entryContents = `import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true }},
);
`;

  // Generate a 'require.context' RegExp that includes only the affected projects.
  entryContents += `
const context = require.context('./', true, /(apps|libs)\\/(.+\\/)?(${karmaProjects.join(
    '|'
  )})\\/src\\/.+\\.spec\\.ts$/);
context.keys().map(context);
`;

  await writeFile(TEST_ENTRY_FILE, entryContents);

  let tsconfig = {
    extends: './tsconfig.base.json',
    compilerOptions: {
      target: 'es2015',
      declaration: true,
      declarationMap: true,
      inlineSources: true,
      outDir: './dist/out-tsc',
      types: ['jasmine', 'node'],
      lib: ['dom', 'es2018'],
    },
    files: ['./__test-affected.ts'],
    include: ['**/*.d.ts'],
    angularCompilerOptions: {
      compilationMode: 'partial',
    },
  };

  // Add affected projects' files to tsconfig 'include' field.
  for (const project of karmaProjects) {
    tsconfig.include.push(`${angularJson.projects[project].root}/**/*.spec.ts`);
  }

  await writeJson(TEST_TSCONFIG_FILE, tsconfig, { spaces: 2 });
}

function removeTempTestingFiles() {
  console.log('Removing temporary test files...');
  if (existsSync(TEST_ENTRY_FILE)) {
    removeSync(TEST_ENTRY_FILE);
  }

  if (existsSync(TEST_TSCONFIG_FILE)) {
    removeSync(TEST_TSCONFIG_FILE);
  }
  console.log('Done removing temp test files.');
}

function getCodeCoverageExcludes(affectedProjects: string[], angularJson: any) {
  return ['**/fixtures/**', '*.fixture.ts'].concat(
    Object.keys(angularJson.projects)
      .filter(
        (projectName) =>
          !IGNORE_PROJECTS.includes(projectName) &&
          !affectedProjects.includes(projectName) &&
          !projectName.endsWith('-testing')
      )
      .map((projectName) => `${angularJson.projects[projectName].root}/**/*`)
  );
}

async function runKarmaTests(
  affectedProjects: string[],
  angularJson: string,
  config: { karmaConfig: string | undefined; codeCoverage: boolean }
) {
  const npxArgs = [
    'nx',
    'run',
    'ci:test-affected',
    `--codeCoverage=${config.codeCoverage}`,
  ];

  if (config.codeCoverage) {
    npxArgs.push(
      `--codeCoverageExclude=${getCodeCoverageExcludes(
        affectedProjects,
        angularJson
      ).join(',')}`
    );
  }

  if (config.karmaConfig) {
    npxArgs.push(`--karmaConfig=${config.karmaConfig}`);
  }

  await runCommand('npx', npxArgs);
}

function logProjectsArray(message: string, projects: string[]) {
  if (projects.length > 0) {
    console.log(
      `${message}
 - ${projects.join('\n - ')}
`
    );
  }
}

process.on('SIGINT', () => process.exit());
process.on('uncaughtException', () => process.exit());
process.on('exit', () => removeTempTestingFiles());

async function testAffected() {
  try {
    const argv = require('minimist')(process.argv.slice(2));
    const codeCoverage: boolean = !!(argv.codeCoverage !== 'false');
    const karmaConfig: string | undefined = argv.karmaConfig;

    // Only run tests against component libraries?
    const onlyComponents: boolean = !!(
      argv.onlyComponents && argv.onlyComponents !== 'false'
    );

    const angularJson = await getAngularJson();

    const affectedProjects = await getAffectedProjectsForTest(
      angularJson,
      onlyComponents
    );

    if (
      affectedProjects.karma.length === 0 &&
      affectedProjects.jest.length === 0
    ) {
      console.log('No affected projects. Aborting tests.');
      process.exit(0);
    }

    const unaffectedProjects = await getUnaffectedProjects(
      affectedProjects.karma.concat(affectedProjects.jest),
      angularJson
    );

    logProjectsArray(
      'Running Karma tests for the following affected projects:',
      affectedProjects.karma
    );

    logProjectsArray('Ignoring the following projects:', unaffectedProjects);

    await createTempTestingFiles(affectedProjects.karma, angularJson);
    await runKarmaTests(affectedProjects.karma, angularJson, {
      codeCoverage,
      karmaConfig,
    });

    // Run non-Karma tests normally, using Nx CLI.
    if (!onlyComponents && affectedProjects.jest.length > 0) {
      logProjectsArray(
        'Running non-Karma tests for the following projects:',
        affectedProjects.jest
      );

      await runCommand('npx', [
        'nx',
        'run-many',
        '--target=test',
        `--projects=${affectedProjects.jest.join(',')}`,
        `--codeCoverage=${codeCoverage}`,
        '--silent',
        '--runInBand',
      ]);
    }

    // Run posttest steps.
    await runCommand('npx', ['nx', 'affected', '--target=posttest']);

    console.log('Library tests completed successfully.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testAffected();
