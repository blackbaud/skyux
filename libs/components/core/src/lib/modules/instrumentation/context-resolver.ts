import { InjectionToken } from '@angular/core';
import { SkyInstrumentationContextValue } from './event-types';

export interface SkyUserEventContextResolver {
  resolve(): SkyInstrumentationContextValue;
}

export const SKY_INSTRUMENTATION_CONTEXT =
  new InjectionToken<SkyUserEventContextResolver>(
    'SKY_INSTRUMENTATION_CONTEXT',
  );
