import { execSync } from 'child_process';
import inquirer from 'inquirer';

import { getCurrentBranch } from './utils/git-utils';

function exec(command: string) {
  execSync(command, {
    stdio: 'inherit',
  });
}

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
    await exec('git fetch --all');
    await exec('git merge origin/main');
  } catch (err) {
    console.log('Address any conflicts and try running the command again.');
    process.exit();
  }

  await exec(
    'git reset $(git merge-base origin/main $(git branch --show-current))'
  );
  await exec('git add .');
  await exec('npx cz');
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
    await exec(
      'git push --force-with-lease --set-upstream origin $(git branch --show-current)'
    );
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

    await promptCommit();
    await promptPush();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

devPristine();
