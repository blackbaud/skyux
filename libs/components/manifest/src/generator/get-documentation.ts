import { SkyManifestPublicApi } from '../types/manifest';

import { validateDocumentationConfigs } from './validations';

export async function getDocumentation(
  publicApi: SkyManifestPublicApi,
): Promise<unknown> {
  const errors: string[] = [];

  errors.push(...(await validateDocumentationConfigs(publicApi)));

  if (errors.length > 0) {
    throw new Error(
      'Encountered the following errors when generating documentation:\n - ' +
        errors.join('\n - '),
    );
  }

  return;
}
