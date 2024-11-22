import { SkyManifestTemplateFeatureDeprecations } from './types/deprecated';
import {
  type SkyManifestDefinition,
  type SkyManifestPublicApi,
} from './types/manifest';
import {
  getDirectiveInputsAndOutputs,
  isDirectiveDefinition,
  isPipeDefinition,
} from './utils';

/**
 * Returns information about deprecated template features (directives,
 * components, and pipes) in the SKY UX public API.
 */
export function getDeprecatedTemplateFeatures(
  publicApi: SkyManifestPublicApi,
): SkyManifestTemplateFeatureDeprecations {
  const deprecations: SkyManifestTemplateFeatureDeprecations = {
    components: [],
    directives: [],
    pipes: [],
  };

  const packageEntries = Object.entries(publicApi.packages) as [
    string,
    SkyManifestDefinition[],
  ][];

  for (const [, definitions] of packageEntries) {
    for (const definition of definitions) {
      if (isDirectiveDefinition(definition)) {
        const category: keyof SkyManifestTemplateFeatureDeprecations =
          definition.kind === 'component' ? 'components' : 'directives';

        if (definition.isDeprecated) {
          deprecations[category].push({
            isDeprecated: true,
            deprecationReason: definition.deprecationReason,
            selector: definition.selector,
          });
        } else {
          const deprecatedProperties = getDirectiveInputsAndOutputs(
            definition,
          ).filter((property) => property.isDeprecated);

          if (deprecatedProperties.length > 0) {
            deprecations[category].push({
              isDeprecated: false,
              properties: deprecatedProperties.map(
                ({ deprecationReason, name }) => ({
                  deprecationReason,
                  name,
                }),
              ),
              selector: definition.selector,
            });
          }
        }
      } else if (isPipeDefinition(definition) && definition.isDeprecated) {
        deprecations.pipes.push({
          deprecationReason: definition.deprecationReason,
          templateBindingName: definition.templateBindingName,
        });
      }
    }
  }

  return deprecations;
}
