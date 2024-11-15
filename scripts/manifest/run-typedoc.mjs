import crossSpawn from 'cross-spawn';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import typedoc, { ReflectionKind } from 'typedoc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginPath = path.join(__dirname, './typedoc-plugin.mjs');

function _exec(command, args) {
  return new Promise((resolve, reject) => {
    const child = crossSpawn(command, args, { stdio: 'pipe' });

    let stdout = '';
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.on('error', (err) => {
      reject(err);
    });

    child.on('exit', () => {
      resolve(stdout);
    });
  });
}

async function runTypeDoc() {
  // await _exec('npx', [
  //   'typedoc',
  //   'libs/components/indicators/src/index.ts',
  //   '--emit',
  //   'docs',
  //   '--json',
  //   'docs-json/indicators.json',
  //   '--plugin',
  //   pluginPath,
  //   '--tsconfig',
  //   'libs/components/indicators/tsconfig.lib.prod.json',
  // ]);

  const output = await _exec('npx', [
    'nx',
    'show',
    'projects',
    '--projects',
    'tag:component', // maybe add new tag named 'docs'?
    '--json',
  ]);

  const projectNames = JSON.parse(output);

  await fsPromises.rm('manifests', { recursive: true });
  await fsPromises.mkdir('manifest');

  for (const projectName of projectNames) {
    const projectRoot = `libs/components/${projectName}`;

    const app = await typedoc.Application.bootstrapWithPlugins({
      entryPoints: [`${projectRoot}/src/index.ts`],
      emit: 'docs',
      excludeExternals: true,
      excludeInternal: true,
      excludePrivate: true,
      excludeProtected: true,
      plugin: pluginPath,
      tsconfig: `${projectRoot}/tsconfig.lib.prod.json`,
      exclude: [
        `!**/${projectRoot}/**`,
        '**/(fixtures|node_modules)/**',
        '**/*+(.fixture|.spec).ts',
      ],
      externalPattern: `!**/${projectRoot}/**`,
    });

    const project = await app.convert();

    if (project) {
      await app.generateJson(project, `manifests/${projectName}.json`);
      // console.log(
      //   project.getReflectionsByKind(ReflectionKind.ClassOrInterface),
      // );
    }
  }
}

runTypeDoc();
