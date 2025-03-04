import { InjectionToken, Type } from '@angular/core';

export type SkyDocsShowcaseModuleExportsType = Record<string, Type<unknown>>;

export const SKY_DOCS_CODE_EXAMPLE_COMPONENTS =
  new InjectionToken<SkyDocsShowcaseModuleExportsType>(
    'SKY_DOCS_CODE_EXAMPLE_COMPONENTS',
  );
