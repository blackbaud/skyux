export interface PublicApiToken {
  name: string;
  customProperty?: string;
  description?: string;
  deprecatedCustomProperties?: string[];
  deprecatedScssVariables?: string[];
  obsoleteCustomProperties?: string[];
  cssProperty?: string;
}
