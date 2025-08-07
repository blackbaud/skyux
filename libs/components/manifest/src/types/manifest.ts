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
export type SkyManifestCodeExampleFiles = Record<string, string>;

/**
 * Information about a single code example.
 * @internal
 */
export interface SkyManifestCodeExample {
  /**
   * The code example's primary component class name.
   */
  componentName: string;
  /**
   * Whether the code example's interactive demo is hidden on the documentation site.
   */
  demoHidden?: boolean;
  /**
   * A collection of source files that comprise the code example.
   */
  files: SkyManifestCodeExampleFiles;
  /**
   * The import path of the code example's primary component. This is usually
   * the NPM package, '@skyux/code-examples'.
   */
  importPath: string;
  /**
   * The relative file path of the primary component. This file is the one
   * that's brought into focus first on StackBlitz.
   */
  primaryFile: string;
  /**
   * The selector of the code example's primary component.
   */
  selector: string;
  /**
   * The title that describes the code example.
   */
  title?: string;
}

/**
 * Information about a collection of code examples.
 * @internal
 */
export interface SkyManifestCodeExamples {
  /**
   * A collection of code examples, keyed by the primary file's docsId.
   */
  examples: Record<string, SkyManifestCodeExample>;
}

/**
 * Information about a parent type definition used for documentation purposes.
 * @internal
 */
export interface SkyManifestDocumentationTypeDefinition
  extends SkyManifestParentDefinition {
  packageName: string;
}

/**
 * @internal
 */
export interface SkyManifestDocumentationGroupPackageInfo {
  packageName: string;
  registryUrl: string;
  repoUrl: string;
}

/**
 * Information about a documentation group.
 * @internal
 */
export interface SkyManifestDocumentationGroup {
  codeExamples: SkyManifestCodeExample[];
  packageInfo: SkyManifestDocumentationGroupPackageInfo;
  publicApi: SkyManifestDocumentationTypeDefinition[];
  testing: SkyManifestDocumentationTypeDefinition[];
}
