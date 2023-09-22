import { workspaceRoot } from '@nrwl/devkit';

import { execSync } from 'child_process';
import { glob } from 'glob';
import { dirname, relative } from 'path';

function getChanges(baseBranch: string): string[] {
  const command = `git diff --name-only origin/${baseBranch}`;
  const changes = execSync(command, { encoding: 'utf-8' });
  return changes.split('\n').filter((change) => change);
}

/**
 * Called from the code-examples.yml workflow to build a matrix of
 * code examples to build.
 */
export async function workflow(
  baseBranch: string | undefined,
  headBranch: string | undefined
) {
  const codeExamplesBasePath = `apps/code-examples/src/app/code-examples`;
  const isPullRequest = !!(baseBranch && headBranch);
  const allExamples = await glob(
    `${workspaceRoot}/${codeExamplesBasePath}/**/demo.component.ts`
  ).then((files) =>
    files
      .map((file) => relative(workspaceRoot, dirname(file)))
      .filter((value, index, self) => value && self.indexOf(value) === index)
  );

  let codeExamples = [...allExamples];

  if (isPullRequest) {
    const changes = getChanges(baseBranch);
    if (
      !changes.includes('.github/workflows/code-examples.yml') &&
      !changes.some((change) => change.startsWith('libs/sdk/code-examples-sdk'))
    ) {
      // In a PR where the code-examples-sdk is not changed, only build the code examples that have changed.
      codeExamples = allExamples.filter((example) =>
        changes.some((change) => change.startsWith(example))
      );
    }
  }
  codeExamples.sort((a, b) => a.localeCompare(b));

  // Break up the code examples into clusters to even out the workflow. Some libraries have way more code examples than others.
  const clusterSize = 4;
  const codeExampleClusters = [];
  const clusters = Math.ceil(codeExamples.length / clusterSize);
  for (let i = 0; i < clusters; i++) {
    codeExampleClusters.push(
      codeExamples.slice(i * clusterSize, (i + 1) * clusterSize)
    );
  }

  return codeExampleClusters.map((codeExampleCluster, index) => ({
    paths: codeExampleCluster.join(','),
    index: index + 1,
  }));
}

// If this file is called from ts-node on the command line, run the workflow.
/* istanbul ignore if */
if (require.main === module) {
  workflow(process.env['GITHUB_BASE_REF'], process.env['GITHUB_HEAD_REF']).then(
    (codeExamples) => console.log(JSON.stringify(codeExamples))
  );
}
