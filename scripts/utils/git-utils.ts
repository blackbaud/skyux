import { getCommandOutput, runCommand } from './spawn';

interface IsGitCleanOptions {
  compareAgainstRemote?: boolean;
}

export async function isGitClean(config?: IsGitCleanOptions) {
  let options: IsGitCleanOptions = {
    compareAgainstRemote: false,
  };

  if (config) {
    options = { ...options, ...config };
  }

  // Fetch any upstream changes before getting the status.
  if (options.compareAgainstRemote) {
    await fetchAll();
  }

  const result = await getCommandOutput('git', ['status']);

  let isClean = result.includes('nothing to commit, working tree clean');
  if (isClean && options.compareAgainstRemote) {
    isClean = result.includes('Your branch is up to date');
  }

  return isClean;
}

export async function getCurrentBranch() {
  return getCommandOutput('git', ['branch', '--show-current']);
}

export async function fetchAll() {
  return getCommandOutput('git', ['fetch', '--all']);
}

export async function checkoutNewBranch(branch: string): Promise<void> {
  const result = await getCommandOutput('git', ['branch', '--list', branch]);
  if (result) {
    throw new Error(`The branch "${branch}" already exists. Aborting.`);
  }

  await runCommand('git', ['checkout', '-b', branch]);
}

export async function addAll(): Promise<void> {
  await runCommand('git', ['add', '.']);
}
