import fsPromises from 'node:fs/promises';
import path from 'node:path';

import { SkyManifestParentDefinition } from '../types/base-def';
import { SkyManifestPublicApi } from '../types/manifest';
import { isDirectiveDefinition } from '../utils';

/**
 * Information about a deprecated property.
 */
interface DeprecatedProperty {
  deprecationReason?: string;
  name: string;
}

/**
 * Information about a deprecated directive.
 */
interface DeprecatedDirective {
  deprecationReason?: string;
  isDeprecated: boolean;
  properties?: DeprecatedProperty[];
  selector: string;
}

/**
 * Information about deprecated template features (directives and components).
 */
interface TemplateFeatureDeprecations {
  components: DeprecatedDirective[];
  directives: DeprecatedDirective[];
}

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

const OUTPUT_PATH = path.normalize(
  'dist/libs/sdk/skyux-eslint/src/rules/template/data/deprecated-template-features.json',
);

async function createJsonFile(
  deprecations: TemplateFeatureDeprecations,
): Promise<void> {
  await fsPromises.writeFile(
    OUTPUT_PATH,
    JSON.stringify(deprecations, undefined, 2),
    { encoding: 'utf-8' },
  );
}

export async function generateEslintManifest(
  publicApi: SkyManifestPublicApi,
): Promise<void> {
  const packageEntries = Object.entries(publicApi.packages) as [
    string,
    SkyManifestParentDefinition[],
  ][];

  const deprecations: TemplateFeatureDeprecations = {
    components: [],
    directives: [],
  };

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

  await createJsonFile(deprecations);
}
