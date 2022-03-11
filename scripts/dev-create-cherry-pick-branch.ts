import minimist from 'minimist';

import { runCommand } from './utils/spawn';

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

async function createCherryPickBranch() {
  try {
    const argv = minimist(process.argv.slice(2));
    const hash = argv.hash;

    if (!hash) {
      throw new Error(
        "A hash for the cherry-pick was not provided. Rerun the command and append: '-- --hash=<hash>'."
      );
    }

    if (!(await isValidHash(hash))) {
      throw new Error(`The hash '${hash}' is not a valid commit hash.`);
    }

    const commitMessage = await runCommand(
      'git',
      ['show', '-s', '--format=%B', hash],
      { stdio: 'pipe' }
    );

    console.log(`Hash found with message: "${commitMessage}"\n`);

    console.log(`Using hash '${hash}' to generate cherry-pick branch...`);

    const branch = `cherry-pick_${hash}_${new Date().getTime()}`;

    await runCommand('git', ['checkout', '-b', branch]);

    try {
      await runCommand('git', ['cherry-pick', hash]);
    } catch (err) {
      console.log(`
Done creating cherry-pick branch. After reviewing the changes and resolving conflicts, run the following:
---
   git add .
   git commit -m "${commitMessage}"
---
`);
    }

    console.log(`
Done creating cherry-pick branch. After reviewing the changes, run the following:
---
   git push --set-upstream origin ${branch}
---
`);
  } catch (err) {
    console.error(`[dev:cherry-pick error] ${err.message}\n`);
    process.exit(1);
  }
}

createCherryPickBranch();
