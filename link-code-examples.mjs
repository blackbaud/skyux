import fsExtra from 'fs-extra';

import publicApiJson from './dist/libs/components/manifest/public-api.json' with { type: 'json' };

function getDefinitionsByFilePaths(filePaths) {
  const definitions = [];

  for (const filePath of filePaths) {
    for (const definition of publicApiJson.packages['@skyux/code-examples']) {
      if (definition.filePath === filePath) {
        definitions.push(definition);
      }
    }
  }

  return definitions;
}

const codeExamples = publicApiJson.packages['@skyux/code-examples'];
const codeExamplesMap = new Map();

for (const { filePath } of codeExamples) {
  const packageName = `@skyux/${filePath.replace('libs/components/code-examples/src/lib/modules/', '').split('/')[0]}`;

  const moduleName = filePath
    .replace('libs/components/code-examples/src/lib/modules/', '')
    .split('/')[1];

  const key = `${packageName}:${moduleName}`;

  if (codeExamplesMap.has(key)) {
    const existing = codeExamplesMap.get(key);
    existing.push(filePath);
    codeExamplesMap.set(key, existing);
  } else {
    codeExamplesMap.set(key, [filePath]);
  }

  // console.log(packageName, moduleName, codeExample.filePath);
}

console.log(codeExamplesMap);

const entryPoints = [];

for (const [packageName, definitions] of Object.entries(
  publicApiJson.packages,
)) {
  for (const definition of definitions) {
    if (definition.docsIncludeIds) {
      const contents = await fsExtra.readFile(definition.filePath, {
        encoding: 'utf-8',
      });

      if (contents.includes('@__checked')) {
        continue;
      }

      entryPoints.push(definition.filePath);

      let moduleName = definition.filePath
        .replace('libs/components/', '')
        .split('/');
      moduleName.shift();
      moduleName = moduleName
        .join('/')
        .replace('src/lib/modules/', '')
        .split('/')[0];

      const key = `${packageName}:${moduleName}`;

      if (codeExamplesMap.has(key)) {
        const found = getDefinitionsByFilePaths(codeExamplesMap.get(key));

        await fsExtra.writeFile(
          definition.filePath,
          `/* @__checked ${found.map((d) => d.docsId).join(', ')} */\n${contents}`,
        );
      } else {
        console.error(`Module does not have code example! ${key}`);
      }
    }
  }
}
