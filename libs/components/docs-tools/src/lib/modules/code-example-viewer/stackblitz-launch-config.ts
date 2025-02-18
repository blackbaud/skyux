/**
 * @internal
 */
export interface SkyStackBlitzLaunchConfig {
  componentName: string;
  componentSelector: string;
  files: Record<string, string>;
  primaryFile: string;
  title: string;
}
