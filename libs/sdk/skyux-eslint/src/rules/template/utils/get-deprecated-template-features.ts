import {
  type SkyManifestParentDefinition,
  getPublicApi,
  isDirectiveDefinition,
} from '@skyux/manifest';

import type { DeprecatedProperty, TemplateFeatureDeprecations } from './types';

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

        if (!selector) {
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
