import { SkyManifestParentDefinition } from './base-def';

/**
 * Information about the SKY UX public API.
 * @internal
 */
export interface SkyManifestPublicApi {
  packages: Record<string, SkyManifestParentDefinition[]>;
}

/**
 * A collection of file contents, keyed by the relative file path.
 * @internal
 */
// export type SkyManifestCodeExampleFiles = Record<string, string>;

/**
 * Information about a single code example.
 * @internal
 */
// export interface SkyManifestCodeExample {
//   componentType: unknown;
//   files: SkyManifestCodeExampleFiles;
//   primaryFile: string;
//   title?: string;
// }

/**
 * Information about a collection of code examples.
 * @internal
 */
// export interface SkyManifestCodeExamples {
//   /**
//    * A collection of code examples, keyed by the primary file's docsId.
//    */
//   examples: Record<string, SkyManifestCodeExample>;
// }

/**
 * Information about a parent type definition used for documentation purposes.
 * @internal
 */
export interface SkyManifestDocumentationTypeDefinition
  extends SkyManifestParentDefinition {
  packageName: string; // DO WE NEED THIS?
}

/**
 * Information about a documentation group.
 * @internal
 */
export interface SkyManifestDocumentationGroup {
  codeExamples: SkyManifestDocumentationTypeDefinition[];
  publicApi: SkyManifestDocumentationTypeDefinition[];
  testing: SkyManifestDocumentationTypeDefinition[];
}
