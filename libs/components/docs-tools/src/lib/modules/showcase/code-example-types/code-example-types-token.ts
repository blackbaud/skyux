import { InjectionToken, Type } from '@angular/core';

/**
 * @internal
 */
export type SkyDocsCodeExampleComponentTypes = Record<string, Type<unknown>>;

/**
 * @internal
 */
export const SKY_DOCS_CODE_EXAMPLE_COMPONENT_TYPES =
  new InjectionToken<SkyDocsCodeExampleComponentTypes>(
    'SKY_DOCS_CODE_EXAMPLE_COMPONENT_TYPES',
  );
