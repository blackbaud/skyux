import { InjectionToken, Type } from '@angular/core';

export type SkyDocsCodeExampleComponentTypes = Record<string, Type<unknown>>;

export const SKY_DOCS_CODE_EXAMPLE_COMPONENT_TYPES =
  new InjectionToken<SkyDocsCodeExampleComponentTypes>(
    'SKY_DOCS_CODE_EXAMPLE_COMPONENT_TYPES',
  );
