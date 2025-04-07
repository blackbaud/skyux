import glob from 'fast-glob';
import fsPromises from 'node:fs/promises';

import {
  SkyManifestDocumentationTypeDefinition,
  getPublicApi,
} from '../dist/libs/components/manifest/src/index.js';

const PUBLIC_API = getPublicApi();

function getDefinitionByDocsId(
  docsId: string,
): SkyManifestDocumentationTypeDefinition {
  for (const [packageName, definitions] of Object.entries(
    PUBLIC_API.packages,
  )) {
    for (const definition of definitions) {
      if (definition.docsId === docsId) {
        return { ...definition, packageName };
      }
    }
  }

  throw new Error(
    `Failed to retrieve type definition with docsId "${docsId}".`,
  );
}

async function refactor(): Promise<void> {
  const files = await glob('libs/components/**/documentation.json', {
    ignore: ['**/manifest-generator/**'],
  });

  for (const file of files) {
    const json = JSON.parse(await fsPromises.readFile(file, 'utf-8'));

    const newJson: {
      $schema: string;
      groups: Record<
        string,
        {
          development: { docsIds: string[]; primaryDocsId: string };
          testing: { docsIds: string[] };
          codeExamples: { docsIds: string[] };
        }
      >;
    } = {
      $schema: json.$schema,
      groups: {},
    };

    for (const group in json.groups) {
      newJson.groups[group] ??= {
        development: { docsIds: [], primaryDocsId: '' },
        testing: { docsIds: [] },
        codeExamples: { docsIds: [] },
      };

      // Determine if docsId is development, testing, or code example.
      for (const docsId of json.groups[group].docsIds) {
        const definition = getDefinitionByDocsId(docsId);

        if (definition.docsId === docsId) {
          if (definition.packageName === '@skyux/code-examples') {
            newJson.groups[group].codeExamples.docsIds.push(docsId);
          } else if (definition.packageName.endsWith('/testing')) {
            newJson.groups[group].testing.docsIds.push(docsId);
          } else {
            newJson.groups[group].development.docsIds.push(docsId);
            newJson.groups[group].development.primaryDocsId =
              json.groups[group].primaryDocsId;
          }
        }
      }
    }

    // console.log(JSON.stringify(json, undefined, 2));
    // console.log(JSON.stringify(newJson, undefined, 2));
    await fsPromises.writeFile(
      file,
      JSON.stringify(newJson, undefined, 2),
      'utf-8',
    );
  }
}

void refactor();
