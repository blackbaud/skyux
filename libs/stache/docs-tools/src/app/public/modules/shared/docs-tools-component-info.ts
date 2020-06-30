/**
 * Represents the structure of information returned from the SKY Supportal's `component-info` endpoint.
 */
export interface SkyDocsComponentInfo {
  children?: SkyDocsComponentInfo[];
  icon?: string;
  name?: string;
  restricted?: boolean;
  summary?: string;
  thumbnail?: string;
  url?: string;
}
