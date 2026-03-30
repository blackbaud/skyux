export interface PublicApiStyle {
  name: string;
  className?: string;
  selectors?: string[];
  properties?: Record<string, string>;
  description?: string;
  deprecatedClassNames?: string[];
  obsoleteClassNames?: string[];
  excludeFromDocs?: boolean;
}
