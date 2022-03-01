// Inspired by: https://github.com/angular/components/blob/master/.circleci/rebase-pr.js

const { execSync } = require('child_process');

/**
 * Rebases the pull request branch onto the target branch.
 *
 * **Context:**
 * Since a GitHub PR is not necessarily up to date with its target branch, it is useful to rebase
 * prior to testing it on CI to ensure more up to date test results.
 *
 * **NOTE:**
 * This script cannot use external dependencies or be compiled because it needs to run before the
 * environment is setup.
 * Use only features supported by the NodeJS versions used in the environment.
 */
function rebasePullRequest() {
  try {
    console.log('Attempting to rebase pull request...');
    const targetBranch = process.env.GITHUB_BASE_REF || '';

    if (!targetBranch) {
      throw new Error('The target branch is not specified!');
    }

    console.log(` - Target branch: ${targetBranch}`);
    execSync(`git rebase origin/${targetBranch}`);
    console.log(`Rebased current branch onto ${targetBranch}.`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

rebasePullRequest();
