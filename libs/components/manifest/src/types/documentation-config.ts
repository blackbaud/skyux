/**
 * @internal
 */
export interface SkyManifestDocumentationGroupConfig {
  /**
   * One sentence that tells developers what the component is for.
   */
  summary: string;
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
