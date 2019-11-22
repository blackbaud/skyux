/**
 * Represents the structure of information returned from the SKY Supportal's `component-info` endpoint.
 */
export interface SkyDocsComponentInfo {
  icon?: string;
  name?: string;
  summary?: string;
  thumbnail?: string;
  url?: string;
  children?: SkyDocsComponentInfo[];
}
