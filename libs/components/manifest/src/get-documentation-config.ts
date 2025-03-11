import documentationConfigJson from '../documentation-config.json';

import { SkyManifestDocumentationConfig } from './types/documentation-config.js';

/**
 * @internal
 */
export function getDocumentationConfig(): SkyManifestDocumentationConfig {
  return documentationConfigJson as SkyManifestDocumentationConfig;
}
