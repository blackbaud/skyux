export interface SkyManifestDocumentationConfig {
  packages: Record<
    string,
    {
      groups: Record<string, { docsIds: string[]; primaryDocsId: string }>;
    }
  >;
}
