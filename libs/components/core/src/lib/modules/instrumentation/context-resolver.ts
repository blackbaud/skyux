import { InjectionToken } from '@angular/core';

export interface SkyUserEventContextResolver {
  resolve(): Record<string, unknown>;
}

export const SKY_INSTRUMENTATION_CONTEXT =
  new InjectionToken<SkyUserEventContextResolver>(
    'SKY_INSTRUMENTATION_CONTEXT',
  );
