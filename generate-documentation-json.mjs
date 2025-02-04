import fsExtra from 'fs-extra';

import manifest from './dist/libs/components/manifest/public-api.json' with { type: 'json' };

const docs = {};

/**
 * {
 *   '@skyux/core': {
 *     projectRoot: string;
 *     documentation: {
 *       groups: {
 *         dropdown: {
 *           docsIds: string[];
 *         }
 *       }
 *     }
 *   }
 * }
 */

for (const [packageName, definitions] of Object.entries(manifest.packages)) {
  for (const definition of definitions) {
    if (definition.docsIncludeIds) {
      docs[packageName] ??= {};
      docs[packageName].projectRoot = definitions[0].filePath.split('/src/')[0];
      docs[packageName].documentation ??= {};
      docs[packageName].documentation.groups ??= {};

      let groupName = definition.filePath
        .replace('libs/components/', '')
        .split('/');
      groupName.shift();
      groupName = groupName
        .join('/')
        .replace('src/lib/modules/', '')
        .split('/')[0];

      docs[packageName].documentation.groups[groupName] ??= {};

      docs[packageName].documentation.groups[groupName].docsIds ??= [];

      docs[packageName].documentation.groups[groupName].docsIds.push(
        ...definition.docsIncludeIds,
      );

      // console.log(groupName, definition.filePath);

      // if (docs.has(packageName)) {
      //   const groups = docs.get(packageName);

      //   docs.set(packageName, )
      // }
    }
  }
}

for (const [, doc] of Object.entries(docs)) {
  await fsExtra.writeJson(
    `${doc.projectRoot}/documentation.json`,
    {
      $schema: '../manifest/documentation-schema.json',
      groups: doc.documentation.groups,
    },
    { spaces: 2 },
  );
}

console.log('DOCUMENTATION:', JSON.stringify(docs, undefined, 2));
