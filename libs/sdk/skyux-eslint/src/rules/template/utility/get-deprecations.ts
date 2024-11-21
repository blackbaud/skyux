import {
  SkyManifestDefinition,
  SkyManifestPublicApi,
  isDirectiveDefinition,
} from '@skyux/manifest';
import publicApi from '@skyux/manifest/public-api.json';

import { Deprecations } from './deprecation-types';

const packages = publicApi.packages as SkyManifestPublicApi;

export function getDeprecations(): Deprecations {
  const deprecations: Deprecations = {
    components: {},
    directives: {},
  };

  const packageEntries = Object.entries(packages) as [
    string,
    SkyManifestDefinition[],
  ][];

  for (const [, definitions] of packageEntries) {
    for (const definition of definitions) {
      if (isDirectiveDefinition(definition)) {
        const category: keyof Deprecations =
          definition.kind === 'component' ? 'components' : 'directives';

        if (definition.isDeprecated) {
          deprecations[category][definition.selector] = {
            deprecated: true,
            reason: definition.deprecationReason,
          };
          continue;
        }

        const properties = definition.inputs.concat(definition.outputs);

        for (const property of properties) {
          deprecations[category][definition.selector] ??= {
            deprecated: false,
            properties: [],
          };

          deprecations[category][definition.selector].properties?.push({
            name: property.name,
            reason: property.deprecationReason,
          });
        }
      }
    }
  }

  return deprecations;
}
