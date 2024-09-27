import { glob } from 'glob';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEPRECATIONS_FILE_PATH = path.normalize(
  'dist/libs/sdk/eslint-plugin-template/src/__deprecations.json',
);

interface DeprecatedProperty {
  name: string;
  reason: string;
}

async function populateNoDeprecatedDirectivesESLintRule(): Promise<void> {
  const selectors: { selector: string; reason: string }[] = [];
  const properties: {
    selector: string;
    inputs?: DeprecatedProperty[];
    outputs?: DeprecatedProperty[];
  }[] = [];

  const files = await glob('dist/libs/components/**/documentation.json');

  for (const file of files) {
    const json = JSON.parse(await readFile(file, { encoding: 'utf-8' }));

    for (const directive of json.typedoc.children) {
      const directiveDecorator = directive.decorators?.[0];

      if (!directiveDecorator) {
        continue;
      }

      if (
        directiveDecorator.name === 'Component' ||
        directiveDecorator.name === 'Directive'
      ) {
        const selector = directiveDecorator.arguments.obj
          .split("selector: '")[1]
          .split("'")[0]
          .replace(/(?:\[|\])/g, '');

        let isDirectiveDeprecated = false;

        if (directive.comment?.blockTags) {
          for (const tag of directive.comment.blockTags) {
            if (tag.tag === '@deprecated') {
              isDirectiveDeprecated = true;

              const reason = tag.content
                .map((x: { text: string }) => x.text.replace('\n', ' '))
                .join('');

              selectors.push({
                reason,
                selector,
              });
            }
          }
        }

        if (!isDirectiveDeprecated) {
          const inputs: DeprecatedProperty[] = [];
          const outputs: DeprecatedProperty[] = [];

          for (const property of directive.children) {
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
                      .join('');

                    if (isInput) {
                      inputs.push({ name: property.name, reason });
                    } else {
                      outputs.push({ name: property.name, reason });
                    }
                  }
                }
              }
            }
          }

          if (inputs.length > 0 || outputs.length > 0) {
            properties.push({
              selector,
              inputs,
              outputs,
            });
          }
        }
      }
    }
  }

  const deprecations = {
    directives: {
      properties,
      selectors,
    },
  };

  await writeFile(DEPRECATIONS_FILE_PATH, JSON.stringify(deprecations));
}

void populateNoDeprecatedDirectivesESLintRule();
