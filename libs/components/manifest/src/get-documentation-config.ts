import documentationConfigJson from '../documentation-config.json';

import { SkyManifestDocumentationConfig } from './types/documentation-config';

export function getDocumentationConfig(): SkyManifestDocumentationConfig {
  return documentationConfigJson as SkyManifestDocumentationConfig;
}
