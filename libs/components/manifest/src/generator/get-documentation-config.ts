import Ajv from 'ajv';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import documentationSchema from '../../documentation-schema.json';
import { SkyManifestDocumentationConfig } from '../types/documentation-config';
import { SkyManifestPublicApi } from '../types/manifest';

import { ProjectDefinition } from './get-project-definitions';
import { validateDocumentationConfig } from './validations';

const ajv = new Ajv();
const validateJson = ajv.compile(documentationSchema);

export async function getDocumentationConfig(
  publicApi: SkyManifestPublicApi,
  projects: ProjectDefinition[],
): Promise<SkyManifestDocumentationConfig> {
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
      errors.push(`Schema validation failed for ${documentationJsonPath}`);
    }

    const packageJson = JSON.parse(
      await fsPromises.readFile(
        path.join(project.projectRoot, 'package.json'),
        { encoding: 'utf-8' },
      ),
    );

    documentationConfig.packages[packageJson.name] = config;
  }

  errors.push(...validateDocumentationConfig(publicApi, documentationConfig));

  if (errors.length > 0) {
    throw new Error(
      'Encountered the following errors when generating documentation:\n - ' +
        errors.join('\n - '),
    );
  }

  return documentationConfig;
}
