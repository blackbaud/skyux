/* eslint-disable complexity, max-depth */
import { glob } from 'glob';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

interface DeprecatedProperty {
  reason?: string;
}

type DeprecatedProperties = Record<string, DeprecatedProperty>;

interface DeprecatedDirective {
  deprecated: boolean;
  reason?: string;
  properties?: DeprecatedProperties;
}

interface Deprecations {
  components?: Record<string, DeprecatedDirective>;
  directives?: Record<string, DeprecatedDirective>;
}

const DEPRECATIONS_FILE_PATH = path.normalize(
  'libs/sdk/skyux-eslint/src/__deprecations.json',
);

/**
 * These selectors are deprecated, but have a non-deprecated replacement. Since
 * the selectors are the same, we won't be able to distinguish between the
 * deprecated selector and the non-deprecated selector.
 */
const EXCLUDE_SELECTORS = ['sky-page'];

/**
 * Refreshes the __deprecations.json file used by the
 * 'skyux-eslint-template/no-deprecated-directives' rule.
 */
async function refreshSkyuxEslintDeprecationsSummary(): Promise<void> {
  const deprecations: Deprecations = {};

  const files = await glob('dist/libs/components/**/documentation.json');

  if (files.length === 0) {
    throw new Error(
      'No documentation.json files found. ' +
        'Did you run `npx skyux-dev create-packages-dist`?',
    );
  }

  for (const file of files) {
    const json = JSON.parse(
      await readFile(path.normalize(file), { encoding: 'utf-8' }),
    );

    for (const docs of json.typedoc.children) {
      const docsDecorator = docs.decorators?.[0];

      if (!docsDecorator) {
        continue;
      }

      const isDirective = docsDecorator.name === 'Directive';

      if (docsDecorator.name === 'Component' || isDirective) {
        let selector: string = docsDecorator.arguments.obj
          .split("selector: '")[1]
          .split("'")[0];

        if (EXCLUDE_SELECTORS.includes(selector)) {
          continue;
        }

        if (isDirective) {
          selector = selector.split('[')[1].split(']')[0];
        }

        const category: keyof Deprecations = isDirective
          ? 'directives'
          : 'components';

        if (docs.comment?.blockTags) {
          for (const tag of docs.comment.blockTags) {
            if (tag.tag === '@deprecated') {
              deprecations[category] ??= {};
              deprecations[category][selector] = {
                deprecated: true,
              };

              const reason = tag.content
                .map((x: { text: string }) => x.text.replace('\n', ' '))
                .join('')
                .trim();

              if (reason) {
                deprecations[category][selector].reason = reason;
              }
            }
          }
        }

        for (const property of docs.children) {
          const propertyDecorator = property.decorators?.[0];

          const isInput =
            propertyDecorator?.name === 'Input' ||
            property.type?.name === 'InputSignal';

          const isOutput =
            propertyDecorator?.name === 'Output' ||
            property.type?.name === 'OutputEmitterRef';

          if (isInput || isOutput) {
            const tags =
              property.comment?.blockTags ??
              property.setSignature?.comment?.blockTags ??
              property.getSignature?.comment?.blockTags;

            if (tags) {
              for (const tag of tags) {
                if (tag.tag === '@deprecated') {
                  const reason = tag.content
                    .map((x: { text: string }) => x.text.replace('\n', ' '))
                    .join('')
                    .trim();

                  deprecations[category] ??= {};
                  deprecations[category][selector] ??= { deprecated: false };

                  const directive = deprecations[category][selector];

                  directive.properties ??= {};
                  directive.properties[property.name] = {};

                  if (reason) {
                    directive.properties[property.name].reason = reason;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  await writeFile(DEPRECATIONS_FILE_PATH, JSON.stringify(deprecations));
}

void refreshSkyuxEslintDeprecationsSummary();
