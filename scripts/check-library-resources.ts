import { isGitClean } from './utils/git-utils';
import { runCommand } from './utils/spawn';

async function checkLibraryResources() {
  try {
    console.log('Checking library resources...');

    await runCommand('./node_modules/.bin/ts-node', [
      '--project',
      './scripts/tsconfig.json',
      './scripts/create-library-resources.ts',
    ]);

    if (!(await isGitClean())) {
      throw new Error(
        'Library resources modules are not up-to-date! Run the following to regenerate all library resources modules:\n' +
          '---\n' +
          ' npm run dev:create-library-resources\n' +
          '---\n'
      );
    } else {
      console.log('Library resources are up-to-date. OK.');
    }
  } catch (err) {
    console.error(`[ci:check-library-resources] error`, err);
    process.exit(1);
  }
}

checkLibraryResources();
