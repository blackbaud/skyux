/**
 * @internal
 */
export interface SkyManifestDocumentationGroupConfig {
  codeExamples: { docsIds: string[] };
  development: { docsIds: string[]; primaryDocsId: string };
  testing: { docsIds: string[] };
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
