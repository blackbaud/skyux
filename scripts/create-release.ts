import fs from 'fs-extra';
import inquirer from 'inquirer';
import standardVersion from 'standard-version';
import { outside as semverOutside, parse as semverParse } from 'semver';
import {
  checkoutNewBranch,
  fetchAll,
  getCurrentBranch,
  isGitClean,
} from './utils/git-utils';
import { checkVersionExists } from './utils/npm-utils';
import { getCommandOutput, runCommand } from './utils/spawn';
import { getSkyuxDevConfig } from './lib/get-skyux-dev-config';

/**
 * Determines if a version is a prerelease.
 * @returns `false` if not a prerelease, `true` if the prerelease group is undefined (e.g. 1.0.0-0), or the string representation of the prerelease group (e.g. 'alpha', 'beta')
 */
function isPrerelease(version: string): string | undefined {
  const semverData = semverParse(version);
  if (!semverData) {
    return;
  }

  /**
   * The semver 'prerelease' value can be an array of length 1 or 2, depending on the prerelease type.
   * For example:
   *   5.0.0-alpha.5 => ['alpha', 5]
   *   5.0.0-5 => [5]
   */
  return semverData.prerelease.length === 1
    ? 'true'
    : semverData.prerelease.length === 0
    ? undefined
    : (semverData.prerelease[0] as string);
}

/**
 * Returns the default config to be passed to 'standard-version'.
 */
async function getStandardVersionConfig(nextVersion: string, overrides = {}) {
  const config: standardVersion.Options = {
    noVerify: true, // skip any precommit hooks
    releaseCommitMessageFormat:
      'docs: Add release notes for {{currentTag}} release',
    tagPrefix: '', // don't prefix tags with 'v'
  };

  const prerelease = isPrerelease(nextVersion);
  if (prerelease) {
    config.prerelease = prerelease;
  }

  return { ...config, ...overrides };
}

/**
 * Returns the bumped version generated by 'standard-version' utility.
 */
async function getNextVersion(currentVersion: string) {
  const args = [
    '--dry-run',
    '--skip.tag',
    '--skip.changelog',
    '--skip.commit',
    '--tagPrefix=""',
  ];

  const prerelease = isPrerelease(currentVersion);
  if (prerelease) {
    args.push(`--prerelease=${prerelease}`);
  }

  // The 'standard-version' API does not provide a way to derive the bumped version programmatically.
  // As a workaround, we'll read the "dry run" output from the console.
  const result: string = await getCommandOutput(
    './node_modules/.bin/standard-version',
    args
  );

  const nextVersion = result
    .trim()
    .match(/[0-9]\.[0-9]\.[0-9](-(\w*\.)?\d+)?$/)![0];

  return nextVersion;
}

/**
 * Throws an error if the provided version does not satisfy the allowed semver range.
 * @param {string} version
 */
async function validateVersion(version: string) {
  const skyDev = await getSkyuxDevConfig();
  const allowedSemverRange = skyDev.allowedSemverRange;

  if (
    semverOutside(version, allowedSemverRange, '<') ||
    semverOutside(version, allowedSemverRange, '>')
  ) {
    throw new Error(
      ` ✘ The version (${version}) does not satisfy the allowed semver range (${allowedSemverRange}) provided in .skyuxdev.json.\n` +
        "To proceed, create a pull request that adjusts the 'allowedSemverRange' to accept the new version."
    );
  }

  console.log(
    ` ✔ The version (${version}) satisfies the allowed semver range (${allowedSemverRange}). OK.`
  );
}

/**
 * Prompts the developer to confirm the final push of the tag/branch to origin.
 */
async function promptPushOrigin(version: string, releaseBranch: string) {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'pushOrigin',
      message: `Push branch and tag to origin?`,
      default: true,
    },
  ]);

  if (!answer.pushOrigin) {
    console.log('Release aborted. Thanks for playing!');
    await cleanup(version, releaseBranch);
    process.exit(0);
  } else {
    await runCommand('git', ['push', '--follow-tags', 'origin', releaseBranch]);
  }
}

async function cleanup(version: string, releaseBranch: string) {
  await runCommand('git', ['checkout', 'main']);
  try {
    await runCommand('git', ['branch', '-D', releaseBranch]);
    await runCommand('git', ['tag', '-d', version]);
  } catch (err) {}
}

/**
 * Creates a 'releases/x.x.x' branch, tags it, and automatically adds release notes to CHANGELOG.md.
 */
async function createRelease() {
  try {
    console.log('Preparing workspace for release...');

    // Ensure all remote changes are represented locally.
    await fetchAll();

    // Ensure releases are executed against the main branch.
    if ((await getCurrentBranch()) !== 'main') {
      throw new Error('Releases can only be triggered on the "main" branch!');
    }

    // Ensure local git is clean.
    if (!(await isGitClean())) {
      throw new Error(
        'Your local branch does not match the remote. ' +
          'Please pull any changes from the remote (or stash any local changes) before creating a release.'
      );
    }

    const packageJson = await fs.readJson('package.json');
    const currentVersion = packageJson.version;

    const versionExists = await checkVersionExists(
      '@skyux/core', // 'core' is arbitrary since all packages have the same version
      currentVersion
    );

    let nextVersion: string;
    if (versionExists) {
      nextVersion = await getNextVersion(currentVersion);
    } else {
      nextVersion = currentVersion;
      console.warn(
        `[!] The current version (${currentVersion}) was not found on the registry. ` +
          'Aborting version bump and assuming first release.'
      );
    }

    await validateVersion(nextVersion);

    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: `This command will generate a tag and release notes for version (${nextVersion}). Proceed?`,
        default: true,
      },
    ]);

    if (!answer.proceed) {
      console.log('Release aborted. Thanks for playing!');
      process.exit(0);
    }

    const branch = `releases/${nextVersion}`;

    console.log(`Creating new branch named '${branch}'...`);

    await checkoutNewBranch(branch);

    console.log('Generating release artifacts...');

    process.on('SIGINT', () => process.exit());
    process.on('uncaughtException', () => process.exit());
    process.on('exit', () => cleanup(nextVersion, branch));

    const standardVersionConfig = await getStandardVersionConfig(nextVersion, {
      firstRelease: !versionExists,
      scripts: {
        // Run prettier on the changelog.
        postchangelog: 'npx prettier --write CHANGELOG.md',
      },
      silent: true,
    });

    // Bump version and create changelog.
    await standardVersion(standardVersionConfig);

    await promptPushOrigin(nextVersion, branch);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createRelease();
