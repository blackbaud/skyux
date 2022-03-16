import inquirer from 'inquirer';

import {
  addAll,
  fetchAll,
  getCurrentBranch,
  isGitClean,
} from './utils/git-utils';
import { getCommandOutput, runCommand } from './utils/spawn';

async function promptCommit() {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'squash',
      message:
        'This command squashes all commits in the current branch with a new commit message that you provide. ' +
        "While local changes remain intact, it rewrites the current branch's commit history. " +
        'Proceed?',
      default: true,
    },
  ]);

  if (!answer.squash) {
    console.log('Squashing aborted.');
    process.exit(0);
  }

  try {
    console.log('Attempting to merge origin/main into feature branch...');
    await fetchAll();
    await runCommand('git', ['merge', 'origin/main']);
  } catch (err) {
    console.log('Address any conflicts and try running the command again.');
    process.exit();
  }

  const currentBranch = await getCurrentBranch();

  const hash = await getCommandOutput('git', [
    'merge-base',
    'origin/main',
    currentBranch,
  ]);

  await runCommand('git', ['reset', hash]);
  await addAll();
  await runCommand('npx', ['cz']);
}

async function promptPush() {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'pushOrigin',
      message: 'Push this change to origin?',
      default: true,
    },
  ]);

  if (answer.pushOrigin) {
    const branch = await getCurrentBranch();
    await runCommand('git', [
      'push',
      '--force-with-lease',
      '--set-upstream',
      'origin',
      branch,
    ]);
    console.log('Commits squashed and pushed!');
  } else {
    console.log(
      'Done squashing commits. Run `git push --force-with-lease` when ready.'
    );
  }
}

async function devPristine() {
  try {
    if ((await getCurrentBranch()) === 'main') {
      throw new Error("This command may not be executed on the 'main' branch.");
    }

    // Ensure local git is clean.
    if (!(await isGitClean())) {
      throw new Error(
        'Uncommitted changes detected. Stash or commit the changes and try again.'
      );
    }

    await promptCommit();
    await promptPush();
  } catch (err) {
    console.error(`[dev:pristine error] ${err.message}\n`);
    process.exit(1);
  }
}

devPristine();
