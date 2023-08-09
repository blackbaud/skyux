import fs from 'fs-extra';
import { globSync } from 'glob';

async function replaceExportAll() {
  const indexFiles = globSync([
    'libs/**/src/index.ts',
    'libs/**/testing/src/public-api.ts',
  ]);

  for (const indexFile of indexFiles) {
    let publicApiContents = (await fs.readFile(indexFile)).toString();

    publicApiContents = publicApiContents.replace(
      /export (\*) from '(\.\/.*)'/g,
      (match, star, exportPath) => {
        const sourceFilePath = `${indexFile.replace(
          /(?:index.ts|public-api.ts)$/,
          ''
        )}${exportPath.replace('./', '')}.ts`;

        const contents = fs.readFileSync(sourceFilePath).toString();

        const exportedNames = [];

        const modified = contents.replace(
          /export (?:abstract )?(?:default )?(?:const )?(?:\w+) (\w+)/g,
          (match, group1) => {
            exportedNames.push(group1);
          }
        );

        if (modified === contents) {
          console.error(
            sourceFilePath,
            `===========\n\n${contents}\n\n===========`
          );
        }

        console.log(exportedNames);

        return match.replace(star, `{${exportedNames.join(',')}}`);
      }
    );

    await fs.writeFile(indexFile, publicApiContents);
  }
}

await replaceExportAll();
