import { createRequire } from 'node:module';

interface PublicApiToken {
  name: string;
  customProperty?: string;
  deprecatedCustomProperties?: string[];
  deprecatedScssVariables?: string[];
}

interface PublicApiTokenGroup {
  groupName: string;
  groups?: PublicApiTokenGroup[];
  tokens?: PublicApiToken[];
}

interface PublicApiTokens {
  groups?: PublicApiTokenGroup[];
  tokens?: PublicApiToken[];
}

const require = createRequire(import.meta.url);

const publicApiTokens =
  require('@blackbaud/skyux-design-tokens/bundles/public-api-tokens.json') as PublicApiTokens;

/**
 * Recursively walks token groups and calls the callback for each token.
 */
function walkTokens(
  groups: PublicApiTokenGroup[] | undefined,
  tokens: PublicApiToken[] | undefined,
  callback: (token: PublicApiToken) => void,
): void {
  for (const token of tokens ?? []) {
    callback(token);
  }
  for (const group of groups ?? []) {
    walkTokens(group.groups, group.tokens, callback);
  }
}

/**
 * Maps each deprecated custom property name to its replacement custom property,
 * or null if the parent token has no canonical customProperty.
 */
export const deprecatedCustomPropsMap: Map<string, string | undefined> =
  new Map();

/**
 * All canonical custom property names defined in public-api-tokens.json.
 */
export const validThemeCustomProperties: Set<string> = new Set();

/**
 * Maps each deprecated SCSS variable name to its replacement custom property,
 * or null if the parent token has no canonical customProperty.
 */
export const deprecatedScssVarMap: Map<string, string | undefined> = new Map();

walkTokens(publicApiTokens.groups, publicApiTokens.tokens, (token) => {
  if (token.customProperty) {
    validThemeCustomProperties.add(token.customProperty);
  }
  for (const prop of token.deprecatedCustomProperties ?? []) {
    deprecatedCustomPropsMap.set(prop, token.customProperty);
  }
  for (const variable of token.deprecatedScssVariables ?? []) {
    deprecatedScssVarMap.set(variable, token.customProperty);
  }
});
