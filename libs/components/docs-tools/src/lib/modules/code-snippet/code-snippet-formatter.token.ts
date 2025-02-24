import { InjectionToken } from '@angular/core';

export type SkyCodeSnippetFormatterFn = (value: string) => string;

export const SKY_CODE_SNIPPET_FORMATTER = new InjectionToken<
  SkyCodeSnippetFormatterFn[]
>('SKY_CODE_SNIPPET_FORMATTER');
