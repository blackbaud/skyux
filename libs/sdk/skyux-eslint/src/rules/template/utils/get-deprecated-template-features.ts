import {
  type SkyManifestParentDefinition,
  type SkyManifestPublicApi,
  isDirectiveDefinition,
} from '@skyux/manifest';

import { DeprecatedProperty, TemplateFeatureDeprecations } from './types';

function getDeprecatedProperties(
  definition: SkyManifestParentDefinition,
): DeprecatedProperty[] {
  return (
    definition.children?.filter((property) => property.isDeprecated) ?? []
  ).map(({ deprecationReason, name }) => ({
    deprecationReason,
    name,
  }));
}

export function getDeprecatedTemplateFeatures(
  publicApi: SkyManifestPublicApi,
): TemplateFeatureDeprecations {
  const deprecations: TemplateFeatureDeprecations = {
    components: [],
    directives: [],
  };

  const packageEntries = Object.entries(publicApi.packages) as [
    string,
    SkyManifestParentDefinition[],
  ][];

  for (const [, definitions] of packageEntries) {
    for (const definition of definitions) {
      if (isDirectiveDefinition(definition)) {
        const { kind, deprecationReason, isDeprecated, selector } = definition;

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
