import { SkyManifestPublicApi } from '../types/manifest';

import { ProjectDefinition } from './get-project-definitions';
import { validateDocumentationConfigs } from './validations';

export async function getDocumentation(
  publicApi: SkyManifestPublicApi,
  projects: ProjectDefinition[],
): Promise<unknown> {
  const errors: string[] = [];

  errors.push(...(await validateDocumentationConfigs(publicApi, projects)));

  if (errors.length > 0) {
    throw new Error(
      'Encountered the following errors when generating documentation:\n - ' +
        errors.join('\n - '),
    );
  }

  return;
}
