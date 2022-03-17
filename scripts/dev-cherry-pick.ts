import inquirer from 'inquirer';
import minimist from 'minimist';

import { getCommandOutput, runCommand } from './utils/spawn';

async function promptContinue() {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'cherryPick',
      message:
        'This command will cherry-pick a commit into a new branch. Proceed?',
      default: true,
    },
  ]);
}

async function promptHash() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'commitHash',
      message: 'Which commit hash should be cherry-picked?',
    },
  ]);
}

async function isValidHash(hash: string): Promise<boolean> {
  try {
    await runCommand('git', ['cat-file', 'commit', hash], {
      stdio: 'pipe',
    });
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Returns the commit message of a given commit hash.
 */
async function getCommitMessageFromHash(hash: string): Promise<string> {
  const commitMessage = getCommandOutput('git', [
    'show',
    '-s',
    '--format=%B',
    hash,
  ]);

  console.log(`Hash found with message: "${commitMessage}"\n`);

  return commitMessage;
}

/**
 * Generates and returns the new cherry-pick branch.
 */
async function checkoutNewBranch(hash: string): Promise<string> {
  console.log(`Using hash '${hash}' to generate cherry-pick branch...`);

  const branch = `cherry-pick_${hash}_${new Date().getTime()}`;
  await runCommand('git', ['checkout', '-b', branch]);

  return branch;
}

/**
 * Cherry-picks a commit into the current branch.
 * If the cherry-pick is successful, it returns true.
 */
async function gitCherryPick(hash: string): Promise<boolean> {
  try {
    await runCommand('git', ['cherry-pick', hash]);
    return true;
  } catch (err) {
    return false;
  }
}

async function cherryPick() {
  try {
    const argv = minimist(process.argv.slice(2));
    let hash = argv.hash;

    const answer1 = await promptContinue();
    if (!answer1.cherryPick) {
      console.log('Cherry-pick aborted.');
      process.exit();
    }

    if (!hash) {
      const answer2 = await promptHash();
      hash = answer2.commitHash;
    }

    if (!(await isValidHash(hash))) {
      throw new Error(`The hash '${hash}' is not a valid commit hash.`);
    }

    const commitMessage = await getCommitMessageFromHash(hash);
    const branch = await checkoutNewBranch(hash);
    const hasMergeConflicts = await gitCherryPick(hash);

    if (hasMergeConflicts) {
      console.log(
        '\nDone creating cherry-pick branch. After reviewing the changes and resolving conflicts, run the following:\n' +
          '---\n' +
          '    git add .\n' +
          `    git commit -m "${commitMessage}"\n` +
          '---\n'
      );
    } else {
      console.log(
        '\nDone creating cherry-pick branch. After reviewing the changes, run the following:\n' +
          '---\n' +
          `    git push --set-upstream origin ${branch}\n` +
          '---\n'
      );
    }
  } catch (err) {
    console.error(`[dev:cherry-pick error] ${err.message}\n`);
    process.exit(1);
  }
}

cherryPick();
