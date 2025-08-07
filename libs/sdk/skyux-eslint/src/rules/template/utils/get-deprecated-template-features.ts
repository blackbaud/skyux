import {
  type SkyManifestParentDefinition,
  getPublicApi,
  isDirectiveDefinition,
} from '@skyux/manifest';

import type { DeprecatedProperty, TemplateFeatureDeprecations } from './types';

// Ignore the following selectors because there is a deprecated and
// non-deprecated version with the same selector and our linter cannot determine
// which is which in the HTML files.
const IGNORE_SELECTORS = ['sky-page'];

function getDeprecatedProperties(
  definition: SkyManifestParentDefinition,
): DeprecatedProperty[] {
  const deprecated = definition.children?.filter(
    (property) => property.isDeprecated,
  );

  if (!deprecated) {
    return [];
  }

  return deprecated.map(({ deprecationReason, name }) => ({
    deprecationReason,
    name,
  }));
}

export function getDeprecatedTemplateFeatures(): TemplateFeatureDeprecations {
  const deprecations: TemplateFeatureDeprecations = {
    components: [],
    directives: [],
  };

  const publicApi = getPublicApi();
  const packageEntries = Object.entries(publicApi.packages) as [
    string,
    SkyManifestParentDefinition[],
  ][];

  for (const [, definitions] of packageEntries) {
    for (const definition of definitions) {
      if (isDirectiveDefinition(definition)) {
        const { kind, deprecationReason, isDeprecated, selector } = definition;

        if (!selector || IGNORE_SELECTORS.includes(selector)) {
          continue;
        }

        const category: keyof TemplateFeatureDeprecations =
          kind === 'component' ? 'components' : 'directives';

        if (isDeprecated) {
          deprecations[category].push({
            isDeprecated: true,
            deprecationReason,
            selector,
          });
        } else {
          const properties = getDeprecatedProperties(definition);

          if (properties.length > 0) {
            deprecations[category].push({
              isDeprecated: false,
              properties,
              selector,
            });
          }
        }
      }
    }
  }

  return deprecations;
}
