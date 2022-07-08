import { spawnSync } from 'child_process';

try {
  const all = process.argv.includes('--all');
  const affectedJson = runCommand(
    'npx',
    'nx',
    'print-affected',
    '--target=build-storybook',
    all ? ' --all' : ''
  );
  const affected = JSON.parse(affectedJson);
  const projects = affected.tasks
    .map((task: any) => task.target.project)
    .filter((project: string) => project && project !== 'storybook');
  const include = projects.map((project: string) => {
    return {
      project,
      token: `PERCY_TOKEN_${project.toUpperCase().replace(/-/g, '_')}_E2E`,
    };
  });
  console.log(`::set-output name=projects::${JSON.stringify(projects)}`);
  console.log(`::set-output name=e2eMap::${JSON.stringify({ include })}`);
} catch (e) {
  console.error(`Unable to read nx projects: ${e}`);
  process.exit(1);
}

function runCommand(cmd: string, ...args: string[]) {
  const command = spawnSync(cmd, args, { stdio: 'pipe' });
  if (typeof command.error === 'undefined') {
    return command.stdout.toString();
  } else {
    throw new Error(command.stderr.toString());
  }
}
