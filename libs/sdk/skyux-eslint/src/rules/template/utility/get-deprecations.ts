import { isDirectiveDefinition, manifest } from '@skyux/manifest';

import { Deprecations } from './deprecation-types';

export function getDeprecations(): Deprecations {
  const deprecations: Deprecations = {
    components: {},
    directives: {},
  };

  for (const [, definitions] of Object.entries(manifest.publicApi.packages)) {
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
