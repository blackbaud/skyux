import { spawn } from 'node:child_process';

interface ProjectDefinition {
  entryPoints: string[];
  packageName: string;
  projectName: string;
  projectRoot: string;
}

function _exec(command: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'pipe' });

    let stdout = '';
    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    let stderr = '';
    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (err) => {
      reject(err);
    });

    child.on('exit', (exitCode) => {
      if (exitCode === 1) {
        reject(new Error(stderr ? stderr : stdout));
      } else {
        resolve(stdout);
      }
    });
  });
}

function ensureTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

async function getNxProjectNames(): Promise<string[]> {
  try {
    const output = await _exec('npx', [
      'nx',
      'show',
      'projects',
      '--projects',
      'tag:component',
      '--json',
    ]);

    const projectNames = JSON.parse(output);

    return projectNames;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export async function getProjects(
  projectsDirectory: string,
): Promise<ProjectDefinition[]> {
  projectsDirectory = ensureTrailingSlash(projectsDirectory);

  const projectNames = await getNxProjectNames();
  const projects: ProjectDefinition[] = [];

  for (const projectName of projectNames) {
    const projectRoot = `${projectsDirectory}${projectName}`;

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
