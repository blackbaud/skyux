/**
 * @internal
 */
export interface SkyDocsStackBlitzLaunchConfig {
  componentName: string;
  componentSelector: string;
  files: Record<string, string>;
  primaryFile: string;
  title: string;
}
