import {
  SkyManifestDocumentationConfig,
  SkyManifestPublicApi,
} from '@skyux/manifest-local';

import Ajv from 'ajv';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import documentationSchema from '../../documentation-schema.json';

import { ProjectDefinition } from './get-project-definitions.js';
import { validateDocumentationConfig } from './validations.js';

const ajv = new Ajv.default();
const validateJson = ajv.compile(documentationSchema);

export async function getDocumentationConfig(
  publicApi: SkyManifestPublicApi,
  projects: ProjectDefinition[],
): Promise<[SkyManifestDocumentationConfig, string[]]> {
  const errors: string[] = [];

  const documentationConfig: SkyManifestDocumentationConfig = {
    packages: {},
  };

  for (const project of projects) {
    const documentationJsonPath = path.join(
      project.projectRoot,
      'documentation.json',
    );

    if (!fs.existsSync(documentationJsonPath)) {
      continue;
    }

    const config = JSON.parse(
      await fsPromises.readFile(path.normalize(documentationJsonPath), {
        encoding: 'utf-8',
      }),
    );

    if (!validateJson(config)) {
      errors.push(
        `Schema validation failed for the documentation.json file found in the "${project.projectName}" project.`,
      );
    }

    // Remove the schema field before merging it into the larger configuration.
    delete config['$schema'];

    const packageJson = JSON.parse(
      await fsPromises.readFile(
        path.join(project.projectRoot, 'package.json'),
        { encoding: 'utf-8' },
      ),
    );

    documentationConfig.packages[packageJson.name] = config;
  }

  errors.push(...validateDocumentationConfig(publicApi, documentationConfig));

  return [documentationConfig, errors];
}
