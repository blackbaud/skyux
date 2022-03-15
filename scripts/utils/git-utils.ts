import { getCommandOutput, runCommand } from './spawn';

export async function isGitClean() {
  const result = await getCommandOutput('git', ['status']);
  return (
    result.includes('nothing to commit, working tree clean') &&
    result.includes('Your branch is up to date')
  );
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
