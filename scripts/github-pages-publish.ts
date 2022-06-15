import { ok } from 'assert';
import { spawnSync } from 'child_process';
import {
  copySync,
  existsSync,
  mkdirpSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'fs-extra';
import * as os from 'os';
import { join } from 'path';

const dryRun = process.argv.includes('--dry-run');
// GITHUB_REF for pull_request: refs/pull/<pr_number>/merge
const prNumber = (process.env.GITHUB_REF || '').split('/')[2];
const storybooks = readdirSync(join('dist', 'storybooks'));
const pagesPath = process.env.GH_PAGES_REPO;
const isPullRequest = process.env.GITHUB_EVENT_NAME === 'pull_request';
const commitMessage = isPullRequest
  ? `skyux #${prNumber} ${process.env.GITHUB_SHA?.substring(0, 8)}`
  : `skyux ${process.env.GITHUB_REF_NAME} ${process.env.GITHUB_SHA?.substring(
      0,
      8
    )}`;
const subdirectory = isPullRequest ? prNumber : process.env.GITHUB_REF_NAME;

if (isPullRequest) {
  if (!prNumber) {
    exitWithError('Unable to determine PR number');
  }
} else {
  if (!subdirectory) {
    exitWithError('Unable to determine branch name');
  }
}
if (!storybooks || storybooks.length === 0) {
  exitWithError('Unable to load storybooks from dist');
}
if (!pagesPath || !existsSync(pagesPath)) {
  exitWithError(`Unable to determine GH_PAGES_REPO`);
}
try {
  runCommand('gh', 'version');
} catch (e) {
  exitWithError(`Please install GitHub CLI https://cli.github.com/`);
}

if (isPullRequest) {
  ok(prNumber);
}
ok(storybooks);
ok(pagesPath);
ok(subdirectory);

// Configure the user information for committing to GitHub Pages.
if (!dryRun) {
  runCommand(
    'git',
    'config',
    '--global',
    'user.name',
    'Blackbaud Sky Build User'
  );
  runCommand(
    'git',
    'config',
    '--global',
    'user.email',
    'sky-build-user@blackbaud.com'
  );
}

// Create a README for the PR, as well as the body of the PR comment.
let readme: string[] = [];
let comment: string[] = [];
if (isPullRequest) {
  readme = [
    `# Sky UX Pull Request Preview`,
    ``,
    `Preview build for [PR #${prNumber}](https://github.com/blackbaud/skyux/pull/${prNumber})`,
    ``,
  ];
  comment = [
    `[Storybook preview](https://blackbaud.github.io/skyux-pr-preview/${prNumber}/storybook/)`,
    ``,
    `Component Storybooks:`,
    ``,
  ];
  storybooks.forEach((project) =>
    comment.push(
      `- [${project}](https://blackbaud.github.io/skyux-pr-preview/${prNumber}/storybooks/${project}/)`
    )
  );
  comment.push(``);
  readme.push(...comment);
}

if (isPullRequest) {
  // Remove old builds -- not related to this PR, but helpful while we're here.
  const currentBuilds = readdirSync(pagesPath, { encoding: 'utf8' }).filter(
    (path) => path.match(/^\d+$/)
  );
  let expectedBuilds: string[];
  try {
    expectedBuilds = runCommandWithOutput(
      'gh',
      'pr',
      'list',
      '-q',
      '.[] | .number',
      '--state=open',
      '--json=number'
    )
      .split(`\n`)
      .map((pr) => pr.trim())
      .filter((pr) => pr);
  } catch (e) {
    exitWithError(`Error retrieving PR list: ${e}`);
  }
  const oldBuilds = currentBuilds.filter((pr) => !expectedBuilds.includes(pr));
  if (oldBuilds.length > 0) {
    try {
      const gitRm = ['-C', pagesPath, 'rm', '-r', '-f', ...oldBuilds];
      if (!dryRun) {
        runCommandWithOutput('git', ...gitRm);
      } else {
        console.log(`git ${gitRm.map((arg) => JSON.stringify(arg)).join(' ')}`);
        console.log(` :::: Dry run, changes not applied ::::`);
      }
    } catch (e) {
      console.error(`Error removing old builds: ${e}`);
      process.exit(1);
    }
  }
}

// Update content and commit.
if (!dryRun) {
  if (existsSync(join(pagesPath, subdirectory))) {
    rmSync(join(pagesPath, subdirectory), { recursive: true, force: true });
  }
  mkdirpSync(join(pagesPath, subdirectory));
  if (isPullRequest) {
    writeFileSync(
      join(pagesPath, subdirectory, 'README.md'),
      readme.join(`\n`)
    );
    copySync(
      join('dist', 'storybook'),
      join(pagesPath, subdirectory, 'storybook')
    );
    copySync(
      join('dist', 'storybooks'),
      join(pagesPath, subdirectory, 'storybooks')
    );
  } else {
    if (existsSync(join(pagesPath, 'storybooks', subdirectory))) {
      rmSync(join(pagesPath, 'storybooks', subdirectory), {
        recursive: true,
        force: true,
      });
    }
    mkdirpSync(join(pagesPath, 'storybooks'));
    copySync(join('dist', 'storybook'), join(pagesPath, subdirectory));
    copySync(
      join('dist', 'storybooks'),
      join(pagesPath, 'storybooks', subdirectory)
    );
  }
  runCommand('git', '-C', pagesPath, 'add', '--all');
  runCommandWithOutput('git', '-C', pagesPath, 'status');
  const pendingChanges = runCommand(
    'git',
    '-C',
    pagesPath,
    'status',
    '-s'
  ).trim();
  if (pendingChanges) {
    runCommandWithOutput('git', '-C', pagesPath, 'commit', '-m', commitMessage);
    runCommandWithOutput('git', '-C', pagesPath, 'push');
  } else {
    console.log(`No changes`);
  }
} else {
  console.log(` :::: Dry run, changes not applied ::::`);
}

// Comment on pull request
if (isPullRequest) {
  const commentsJson = runCommand(
    'gh',
    'api',
    '-H',
    'Accept: application/vnd.github.v3+json',
    `/repos/blackbaud/skyux/issues/${prNumber}/comments`
  );
  const commentsData: any[] = JSON.parse(commentsJson);
  const commentToUpdate = commentsData.find((comment) =>
    comment.body.startsWith('[Storybook preview]')
  );
  if (!commentToUpdate.id) {
    if (!dryRun) {
      const tempFile = join(os.tmpdir(), 'pr_comment.md');
      writeFileSync(tempFile, comment.join(`\n`));
      runCommand('gh', 'pr', 'comment', prNumber, '-F', tempFile);
    } else {
      console.log(` :::: Dry run, not adding comment to PR ::::`);
    }
  } else {
    if (!dryRun) {
      const tempFile = join(os.tmpdir(), 'pr_comment.json');
      writeFileSync(tempFile, JSON.stringify({ body: comment.join(`\n`) }));
      runCommand(
        'gh',
        'api',
        '--method',
        'PATCH',
        '-H',
        'Accept: application/vnd.github.v3+json',
        `/repos/blackbaud/skyux/issues/comments/${commentToUpdate.id}`,
        '--input',
        tempFile
      );
    } else {
      console.log(` :::: Dry run, not updating comment on PR ::::`);
    }
  }
}

// Verify GitHub Pages are finished publishing before running e2e tests
if (!dryRun) {
  let latestCommit = runCommand(
    'git',
    '-C',
    pagesPath,
    'log',
    '-1',
    '--format=%H'
  ).trim();
  for (let i = 1; i <= 10; i++) {
    if (checkGitHubPages(i, latestCommit)) {
      break;
    } else if (i === 5) {
      runCommand(
        'git',
        '-C',
        pagesPath,
        'commit',
        '--allow-empty',
        '-m',
        'Trigger rebuild'
      );
      runCommand('git', '-C', pagesPath, 'push');
      latestCommit = runCommand(
        'git',
        '-C',
        pagesPath,
        'log',
        '-1',
        '--format=%H'
      ).trim();
    }
  }
} else {
  console.log(` :::: Dry run, not verifying GH Pages published ::::`);
}

function runCommand(cmd: string, ...args: string[]) {
  const command = spawnSync(cmd, args, { stdio: 'pipe' });
  if (typeof command.error === 'undefined') {
    return command.stdout.toString();
  } else {
    throw new Error(command.stderr.toString());
  }
}

function runCommandWithOutput(cmd: string, ...args: string[]) {
  console.log(`# ${cmd} ${args.map((arg) => JSON.stringify(arg)).join(' ')}`);
  const output = runCommand(cmd, ...args);
  console.log(output);
  return output;
}

function exitWithError(message: string) {
  console.error(message);
  process.exit(1);
}

function checkGitHubPages(i: number, latestCommit: string) {
  runCommand('sleep', `${i * 2}`);
  let currentBuild = '';
  try {
    currentBuild = runCommand(
      'gh',
      'api',
      '-H',
      'Accept: application/vnd.github.v3+json',
      `/repos/${pagesPath}/pages/builds`,
      '--jq',
      `.[] | select(.commit == "${latestCommit}") | .commit`
    ).trim();
  } catch (e) {
    //
  }
  return currentBuild === latestCommit;
}
