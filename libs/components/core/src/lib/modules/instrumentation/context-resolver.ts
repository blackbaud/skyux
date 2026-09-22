import { InjectionToken } from '@angular/core';
import { SkyInstrumentationContextValue } from './event-types';

export interface SkyInstrumentationContextResolver {
  resolve(): SkyInstrumentationContextValue;
}

export const SKY_INSTRUMENTATION_CONTEXT =
  new InjectionToken<SkyInstrumentationContextResolver>(
    'SKY_INSTRUMENTATION_CONTEXT',
  );
