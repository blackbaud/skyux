/**
 * @internal
 */
export interface SkyManifestDocumentationGroupConfig {
  development: { docsIds: string[]; primaryDocsId: string };
  testing: { docsIds: string[] };
  codeExamples: { docsIds: string[] };
}

/**
 * @internal
 */
export interface SkyManifestDocumentationConfig {
  packages: Record<
    string,
    {
      groups: Record<string, SkyManifestDocumentationGroupConfig>;
    }
  >;
}
