import crossSpawn from 'cross-spawn';

export interface ProjectDefinition {
  entryPoints: string[];
  packageName: string;
  projectName: string;
  projectRoot: string;
}

const ROOT_PATH = 'libs/components/';
// const ROOT_PATH = 'scripts/manifest/fixtures/example-packages/';

function _exec(command: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = crossSpawn(command, args, { stdio: 'pipe' });

    let stdout = '';
    child.stdout?.on('data', (data) => {
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

export async function getProjects(): Promise<ProjectDefinition[]> {
  const output = await _exec('npx', [
    'nx',
    'show',
    'projects',
    '--projects',
    'tag:component', // maybe add new tag named 'docs'?
    '--json',
  ]);

  const projectNames = JSON.parse(output);

  // const projectNames = ['foo'];

  const projects: ProjectDefinition[] = [];

  for (const projectName of projectNames) {
    const projectRoot = `${ROOT_PATH}${projectName}`;

    projects.push({
      entryPoints: [
        `${projectRoot}/src/index.ts`,
        `${projectRoot}/testing/src/public-api.ts`,
      ],
      packageName: `@skyux/${projectName}`,
      projectName,
      projectRoot,
    });
  }

  return projects;
}
