import { Tree, getProjects, logger, visitNotIgnoredFiles } from '@nx/devkit';

import { SwitchToVariationsGeneratorSchema } from './schema';

export default function (
  tree: Tree,
  options: SwitchToVariationsGeneratorSchema,
): void {
  const projectConfiguration = getProjects(tree).get(options.project);
  if (!projectConfiguration) {
    throw new Error(`Project ${options.project} not found`);
  }

  // istanbul ignore if
  if (!(projectConfiguration.sourceRoot && projectConfiguration.targets)) {
    throw new Error(`Project source root or targets could not be found`);
  }

  if (!projectConfiguration.targets['e2e']) {
    throw new Error(`Project ${options.project} is not an e2e project`);
  }

  visitNotIgnoredFiles(tree, projectConfiguration.sourceRoot, (filepath) => {
    let reason = '';
    if (filepath.endsWith('.spec.ts') || filepath.endsWith('.cy.ts')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const source = tree.read(filepath, 'utf-8')!;
      // Quick check if this looks like the old pattern
      if (
        source.startsWith(
          `['default', 'modern-light', 'modern-dark'].forEach((theme) => {`,
        )
      ) {
        const describePattern =
          /^ {2}describe\(`([-\w ]+) in \$\{theme} theme`, \(\) => \{$/;
        const specLines = source.split(/\r?\n/);
        specLines.shift(); // Remove first line
        const describeLine = `${specLines.shift()}`;
        if (describeLine.match(describePattern)) {
          // Strip empty lines from the bottom of the file
          while (specLines[specLines.length - 1].trim() === '') {
            specLines.pop();
          }
          const lastLine = specLines.pop();
          // Is this a single block?
          if (
            lastLine === '});' &&
            specLines.every((line) => line.startsWith('  ') || line === '')
          ) {
            const newSpecLines = [
              `import { E2eVariations } from '@skyux-sdk/e2e-schematics';`,
              '',
              describeLine.replace(
                describePattern,
                (_, description) => `describe(\`${description}\`, () => {`,
              ),
              '  E2eVariations.forEachTheme((theme) => {',
              '    describe(`in ${theme} theme`, () => {',
            ];
            newSpecLines.push(
              ...specLines.map((line) => (line === '' ? '' : `  ${line}`)),
              '  });',
              '});',
              '',
            );
            tree.write(filepath, newSpecLines.join(`\n`));
            return;
          } else if (lastLine === '});') {
            reason = 'multiple blocks';
          } else {
            reason = `last line is ${lastLine}`;
          }
        } else {
          reason = `describe line does not match: ${describeLine}`;
        }
        logger.info(`Unable to update ${filepath}: ${reason}`);
      }
    }
  });
}
