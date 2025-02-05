import { SkyManifestParentDefinition } from './base-def';

/**
 * Information about the SKY UX public API.
 * @internal
 */
export interface SkyManifestPublicApi {
  packages: Record<string, SkyManifestParentDefinition[]>;
}

export type SkyManifestCodeExampleFiles = Record<string, string>;

export interface SkyManifestCodeExample {
  files: SkyManifestCodeExampleFiles;
  primaryFile: string;
}

export interface SkyManifestCodeExamples {
  /**
   * A collection of code examples, keyed by the primary file's docsId.
   */
  examples: Record<string, SkyManifestCodeExample>;
}

export interface SkyManifestDocumentationTypeDefinition
  extends SkyManifestParentDefinition {
  packageName: string;
}

export interface SkyManifestDocumentation {
  codeExamples: SkyManifestCodeExample[];
  publicApi: SkyManifestDocumentationTypeDefinition[];
  testing: SkyManifestDocumentationTypeDefinition[];
}
