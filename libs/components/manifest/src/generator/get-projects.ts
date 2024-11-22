import { spawn } from 'node:child_process';

interface ProjectDefinition {
  entryPoints: string[];
  packageName: string;
  projectName: string;
  projectRoot: string;
}

const ROOT_PATH = 'libs/components/';

function _exec(command: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'pipe' });

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
    'tag:component',
    '--json',
  ]);

  const projectNames = JSON.parse(output);
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
